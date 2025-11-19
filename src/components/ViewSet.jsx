import PokeSets from "./PokeSets";
import { useParams } from "react-router";
import { useEffect,useState } from "react";
import TCGdex from "@tcgdex/sdk";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Pagination } from "react-bootstrap";
import SortingDropdown from "./SortingDropdown";

const sortOptions = [
  { label: "Name (A → Z)", value: "name-asc" },
  { label: "Name (Z → A)", value: "name-desc" },
  { label: "Price (Low → High)", value: "price-asc" },
  { label: "Price (High → Low)", value: "price-desc" },
];

export default function ViewSet() {
  const { id } = useParams();
  const [set, setSet] = useState(null);
  const [cards,setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const cardsPerPage = 20;
  const tcgdex = new TCGdex("en");

  useEffect(() => {
    async function loadSet() {
      try {
        const data = await tcgdex.fetch("sets", id);
        setSet(data);
        setCards(data.cards ?? []);
        setCurrentPage(1);
        setVisibleCards(data.cards?.slice(0, cardsPerPage) ?? []);
      } catch (err) {
        console.error("Error fetching set:", err);
      }
    }

    loadSet();
  }, [id]);


  const updateVisibleCards = (cards, page) => {
    const startIndex = (page - 1) * cardsPerPage;
    const cardSlice = cards.slice(startIndex, startIndex + cardsPerPage);
    setVisibleCards(cardSlice); 
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    updateVisibleCards(cards, pageNumber);
    setImagesLoaded(false);
  };

  const totalPages = Math.ceil(cards.length / cardsPerPage);

  useEffect(() => {
    if (visibleCards.length === 0) return;

    let loaded = 0;
    visibleCards.forEach((card) => {
      const img = new Image();
      img.src = card.image + "/low.png";
      
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === visibleCards.length) setImagesLoaded(true);
      };
    });
  }, [visibleCards]);

  if (!set) return <div className="center text-center">Loading…</div>;
  if (!imagesLoaded) {return <div className="text-center mt-5">Loading card images...</div>;}
  



  return (
    <Container className="mt-4">
      <div style={{display: "flex",flexDirection: "column",alignItems: "center",}}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <h1 className="text-center mb-4">{set.name}</h1>
          <img
            src={set.logo + ".png"} 
            alt={set.name}
            className="img-fluid my-3"
            style={{ maxHeight: "80px", objectFit: "contain" }}
            onError={(e) =>
            (e.target.src ="https://assets.tcgdex.net/en/base/base1/logo.webp")}
          />
        </div>
        <SortingDropdown className ="center"options={sortOptions}/>
      </div>


      <Row className="g-4 my-2">
        {visibleCards.map((card) => (
          
      
          <Col key={card.id} xs={12} sm={6} md={4} lg={3}>
            <div className="border rounded-3 p-3 shadow h-100 d-flex flex-column align-items-center text-center">
              <img
                src={card.image + "/low.png"}
                alt={card.name}
                className="img-fluid mb-2"
                style={{ maxHeight: "200px", objectFit: "contain" }}
              />
              <h6 className="mt-2">{card.name} {card.localId}/{set.cardCount.total}</h6>
            </div>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1} 
          />
          <Pagination.Prev 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1} 
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages} 
          />
          <Pagination.Last 
            onClick={() => handlePageChange(totalPages)} 
            disabled={currentPage === totalPages} 
          />
        </Pagination>
      </div>
    </Container>
  );
}