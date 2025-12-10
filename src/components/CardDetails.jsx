import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import TCGdex from "@tcgdex/sdk";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Toast, ToastContainer } from "react-bootstrap";

export default function CardDetails({ user }) {
  const { setId, cardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [set, setSet] = useState(null);
  const [cardPrice, setCardPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const tcgdex = new TCGdex("en");

  useEffect(() => {
    const loadCardDetails = async () => {
      try {
        const setData = await tcgdex.fetch("sets", setId);
        setSet(setData);

        const cardData = setData.cards.find(c => c.id === cardId);
        const clickedCard = `${setId}-${cardData.localId}`;

        const priceData = await fetch(
            `https://api.tcgdex.net/v2/en/cards/${clickedCard}`
            ).then(res => res.json());

        setCardPrice(priceData);

        
        if (cardData) {
          const fullCard = await tcgdex.card.get(clickedCard);
          console.log(clickedCard)
          setCard(fullCard);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading card details:", err);
        setLoading(false);
      }
    };

    loadCardDetails();
  }, [setId, cardId]);

  const handleAddToCollection = async () => {
    if (!user) {
      setToastMessage("Please log in to add cards");
      setShowToast(true);
      return;
    }

    try {
      const cardsRef = collection(db, "userCards");
      const q = query(
        cardsRef,
        where("userId", "==", user.uid),
        where("cardId", "==", card.id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setToastMessage(`${card.name} is already in your collection!`);
        setShowToast(true);
        return;
      }

      await addDoc(collection(db, "userCards"), {
        userId: user.uid,
        cardId: card.id,
        cardName: card.name,
        cardImage: card.image + "/low.png",
        setId: set.id,
        setName: set.name,
        localId: card.localId,
        addedAt: new Date(),
      });

      setToastMessage(`${card.name} added to your collection!`);
      setShowToast(true);
    } catch (error) {
      console.error("Error adding card:", error);
      setToastMessage(`Error: ${error.message}`);
      setShowToast(true);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      setToastMessage("Please log in to add cards to wishlist");
      setShowToast(true);
      return;
    }

    try {
      const wishListRef = collection(db, "wishList");
      const q = query(
        wishListRef,
        where("userId", "==", user.uid),
        where("cardId", "==", card.id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setToastMessage(`${card.name} is already in your wishlist!`);
        setShowToast(true);
        return;
      }

      await addDoc(collection(db, "wishList"), {
        userId: user.uid,
        cardId: card.id,
        cardName: card.name,
        cardImage: card.image + "/low.png",
        setId: set.id,
        setName: set.name,
        localId: card.localId,
        addedAt: new Date(),
      });

      setToastMessage(`${card.name} added to your wishlist!`);
      setShowToast(true);
    } catch (error) {
      console.error("Error adding card to wishlist:", error);
      setToastMessage(`Error: ${error.message}`);
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!card) {
    return (
      <Container className="mt-5">
        <h2 className="text-center">Card not found</h2>
        <div className="text-center mt-3">
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Back to Set
      </Button>

      <Row>
        {/* Left Column - Card Image */}
        <Col lg={5} className="mb-4">
          <Card className="shadow">
            <Card.Img
              variant="top"
              src={card.image + "/high.png"}
              alt={card.name}
              onError={(e) => {
                e.target.src = card.image + "/low.png";
              }}
              style={{ objectFit: "contain", padding: "20px" }}
            />
          </Card>
          <div className="text-center mt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCollection}
              className="w-100 mb-2"
            >
              Add to Collection
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={handleAddToWishlist}
              className="w-100"
            >
              Add to Wishlist
            </Button>
          </div>
        </Col>

        {/* Right Column - Card Details */}
        <Col lg={7}>
          <h1 className="mb-3">
            {card.name}{" "}
            <Badge bg="secondary">
              {card.localId}/{set.cardCount.total}
            </Badge>
          </h1>

          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Card Information</h5>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Set:</strong> {set.name}
                  </p>
                  <p>
                    <strong>Series:</strong> {set.series?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Release Date:</strong>{" "}
                    {new Date(set.releaseDate).toLocaleDateString()}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Rarity:</strong>{" "}
                    <Badge bg="info">{card.rarity || "N/A"}</Badge>
                  </p>
                  {card.hp && (
                    <p>
                      <strong>HP:</strong> {card.hp}
                    </p>
                  )}
                  {card.types && card.types.length > 0 && (
                    <p>
                      <strong>Type:</strong> {card.types.join(", ")}
                    </p>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Market Prices */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
                <h5 className="mb-3">Market Prices (USD)</h5>

                {cardPrice?.pricing?.tcgplayer ? (
                <Row>
                    {Object.entries(cardPrice.pricing.tcgplayer).map(([variant, prices]) => (
                    <Col md={6} key={variant} className="mb-3">
                        <h6 className="text-capitalize">{variant}</h6>

                        {prices.lowPrice !== undefined && (
                        <p><strong>Low:</strong> ${prices.lowPrice.toFixed(2)}</p>
                        )}
                        {prices.midPrice !== undefined && (
                        <p><strong>Mid:</strong> ${prices.midPrice.toFixed(2)}</p>
                        )}
                        {prices.highPrice !== undefined && (
                        <p><strong>High:</strong> ${prices.highPrice.toFixed(2)}</p>
                        )}
                        {prices.marketPrice !== undefined && (
                        <p><strong>Market:</strong> ${prices.marketPrice.toFixed(2)}</p>
                        )}
                    </Col>
                    ))}
                </Row>
                ) : (
                <p className="text-muted">Price information not available</p>
                )}
            </Card.Body>
            </Card>


          {/* Card Abilities/Attacks */}
          {card.attacks && card.attacks.length > 0 && (
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Attacks</h5>
                {card.attacks.map((attack, idx) => (
                  <div key={idx} className="mb-3 pb-3 border-bottom">
                    <h6>
                      {attack.name}{" "}
                      {attack.damage && <Badge bg="danger">{attack.damage}</Badge>}
                    </h6>
                    {attack.cost && (
                      <p className="mb-1">
                        <strong>Cost:</strong> {attack.cost.join(", ")}
                      </p>
                    )}
                    {attack.effect && (
                      <p className="text-muted mb-0">{attack.effect}</p>
                    )}
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Abilities */}
          {card.abilities && card.abilities.length > 0 && (
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Abilities</h5>
                {card.abilities.map((ability, idx) => (
                  <div key={idx} className="mb-2">
                    <h6>{ability.name}</h6>
                    <p className="text-muted">{ability.effect}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Weakness/Resistance */}
          {(card.weaknesses || card.resistances) && (
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Row>
                  {card.weaknesses && card.weaknesses.length > 0 && (
                    <Col md={6}>
                      <h6>Weaknesses</h6>
                      {card.weaknesses.map((weakness, idx) => (
                        <Badge bg="warning" className="me-2" key={idx}>
                          {weakness.type} {weakness.value}
                        </Badge>
                      ))}
                    </Col>
                  )}
                  {card.resistances && card.resistances.length > 0 && (
                    <Col md={6}>
                      <h6>Resistances</h6>
                      {card.resistances.map((resistance, idx) => (
                        <Badge bg="success" className="me-2" key={idx}>
                          {resistance.type} {resistance.value}
                        </Badge>
                      ))}
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

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
