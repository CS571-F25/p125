import PokeSets from "./PokeSets";
import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import TCGdex from "@tcgdex/sdk";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Pagination, Toast, ToastContainer, Button } from "react-bootstrap";
import SortingDropdown from "./SortingDropdown";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const sortOptions = [
  { label: "Name (A → Z)", value: "name-asc" },
  { label: "Name (Z → A)", value: "name-desc" },
];

export default function ViewSet({ user }) {
  const { id } = useParams();
  const [set, setSet] = useState(null);
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
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

  const sortCards = (cardsToSort, sortValue) => {
    const sorted = [...cardsToSort];
    
    switch (sortValue) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    return sorted;
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    const sortedCards = sortCards(cards, sortValue);
    setCards(sortedCards);
    setCurrentPage(1);
    updateVisibleCards(sortedCards, 1);
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

  const handleCardClick = async (card) => {
    if (!user) {
      console.log("No user logged in");
      setToastMessage("Please log in to add cards");
      setShowToast(true);
      return;
    }

    console.log("Adding card:", card.name, "for user:", user.uid);

    try {
      const cardsRef = collection(db, "userCards");
      const q = query(
        cardsRef,
        where("userId", "==", user.uid),
        where("cardId", "==", card.id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Card already in collection");
        setToastMessage(`${card.name} is already in your collection.`);
        setShowToast(true);
        return;
      }

      const docRef = await addDoc(collection(db, "userCards"), {
        userId: user.uid,
        cardId: card.id,
        cardName: card.name,
        cardImage: card.image + "/low.png",
        setId: set.id,
        setName: set.name,
        localId: card.localId,
        addedAt: new Date(),
      });

      console.log("Card added successfully with ID:", docRef.id);
      setToastMessage(`${card.name} added to your collection!`);
      setShowToast(true);
    } catch (error) {
      console.error("Error adding card:", error);
      setToastMessage(`Error: ${error.message}`);
      setShowToast(true);
    }
  };

  if (!set) return <div className="center text-center">Loading…</div>;
  if (!imagesLoaded) {
    return <div className="text-center mt-5">Loading card images...</div>;
  }

  return (
    <Container className="mt-4">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <h1 className="text-center mb-4">{set.name}</h1>
          <img
            src={set.logo + ".png"}
            alt={set.name}
            className="img-fluid my-3"
            style={{ maxHeight: "80px", objectFit: "contain" }}
            onError={(e) =>
              (e.target.src =
                "https://assets.tcgdex.net/en/base/base1/logo.webp")
            }
          />
        </div>
        <SortingDropdown className="center" options={sortOptions} onChange={handleSortChange} />
      </div>

      <Row className="g-4 my-2">
        {visibleCards.map((card) => (
          <Col key={card.id} xs={12} sm={6} md={4} lg={3}>
            <div className="border rounded-3 p-3 shadow h-100 d-flex flex-column align-items-center text-center">
              <Link to={`/card/${set.id}/${card.id}`} className="text-decoration-none">
                <img
                  src={card.image + "/low.png"}
                  alt={card.name}
                  className="img-fluid mb-2"
                  style={{ maxHeight: "200px", objectFit: "contain", cursor: "pointer" }}
                />
              </Link>
              <h6 className="mt-2 mb-3">
                {card.name} {card.localId}/{set.cardCount.total}
              </h6>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCardClick(card)}
                className="mt-auto"
              >
                Add to Collection
              </Button>
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

      {/* Toast centered on screen */}
      <ToastContainer
        className="p-3"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Card Collection</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
