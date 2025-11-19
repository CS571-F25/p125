import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TCGdex from "@tcgdex/sdk";
import { Link } from "react-router";

export default function PokeSets() {
  const [sets, setSets] = useState([]);
  const [visibleSets, setVisibleSets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const setsPerPage = 20;
  const tcgdex = new TCGdex("en");

  useEffect(() => {
    const loadSets = async () => {
      try {
        const sets = await tcgdex.fetch("sets");
        sets.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        setSets(sets);
      } catch (err) {
        console.error("Error loading sets:", err);
      }
    };
    loadSets();
  }, []);

  const updateVisibleSets = (sets, page) => {
    const startIndex = (page - 1) * setsPerPage;
    const pageSlice = sets.slice(startIndex, startIndex + setsPerPage);
    setVisibleSets(pageSlice);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    updateVisibleSets(sets, pageNumber);
    setImagesLoaded(false);
  };

  const totalPages = Math.ceil(sets.length / setsPerPage);

  useEffect(() => {
    if (visibleSets.length === 0) return;

    let loadedCount = 0;
    visibleSets.forEach((set) => {
      const setImage = new Image();
      setImage.src = set.logo + ".png";
      setImage.onload = () => {
        loadedCount++;
        if (loadedCount === visibleSets.length*2) setImagesLoaded(true);
      };
      setImage.onerror = () => {
        loadedCount++;
        if (loadedCount === visibleSets.length*2) setImagesLoaded(true);
      };

      const setSymbol = new Image();
      setSymbol.src = set.symbol + ".png";
      setSymbol.onload = () => {
        loadedCount++;
        if (loadedCount === visibleSets.length*2) setImagesLoaded(true);
      };
      setSymbol.onerror = () => {
        loadedCount++;
        if (loadedCount === visibleSets.length*2) setImagesLoaded(true);
      };
    });
  }, [visibleSets]);

    useEffect(() => {
        setCurrentPage(1);
        updateVisibleSets(sets, 1);
    }, [sets]);

  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  if (!imagesLoaded) {
    return <div className="text-center mt-5">Loading images...</div>;
  }

  return (
    <Container className="mt-4">
      <Row className="g-4">
        {visibleSets.map((set) => (
          <Col key={set.id} xs={12} sm={6} md={4} lg={3}>
            <Link
                to={`/viewset/${set.id} `}
                className="text-decoration-none text-dark"
                style={{ cursor: "pointer" }}
            >
            <div className="position-relative border rounded-3 p-3 shadow h-100 d-flex flex-column align-items-center text-center">
                <div className="position-absolute top-0 end-0 p-2" style={{ fontSize: "0.75rem" }}>
                    {set.cardCount?.total + " cards" || "?"}
                </div>

                <div className="position-absolute top-0 start-0">
                    <img
                        src={set.symbol + ".png"}
                        alt={set.name}
                        style={{ width: "32px", height: "auto", padding: "6px" }}
                        onError={(e) => (e.target.src = "https://assets.tcgdex.net/univ/pop/pop1/symbol.png")}
                    />
                </div>

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
    
              <h5 className="mb-1">{set.name}</h5>
              <p className="mb-1">{set.series?.name}</p>
            </div>
            </Link>
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
          {paginationItems}
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
