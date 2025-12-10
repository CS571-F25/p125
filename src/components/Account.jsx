import { useEffect, useState } from "react";
import { Link } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DeleteAccount from "./DeleteAccount";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Account({ user }) {
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserCards = async () => {
      try {
        console.log("Fetching cards for user:", user.uid);
        const cardsRef = collection(db, "userCards");
        const q = query(cardsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const cards = [];
        querySnapshot.forEach((doc) => {
          cards.push({ id: doc.id, ...doc.data() });
        });
        
        console.log("Fetched cards:", cards.length);
        
        // Sort by most recently added
        cards.sort((a, b) => b.addedAt?.seconds - a.addedAt?.seconds);
        setUserCards(cards);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setLoading(false);
      }
    };

    fetchUserCards();
  }, [user]);

  const handleRemoveCard = async (cardDocId) => {
    try {
      console.log("Removing card with ID:", cardDocId);
      await deleteDoc(doc(db, "userCards", cardDocId));
      setUserCards(userCards.filter(card => card.id !== cardDocId));
      console.log("Card removed successfully");
    } catch (error) {
      console.error("Error removing card:", error);
      alert(`Error removing card: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading your collection...</div>;
  }

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Account Overview</h1>

      <Row className="mb-4">
        <Col md={6} lg={4}>
          <Card className="text-center shadow-sm mb-3">
            <Card.Body>
              <Card.Title>User Name</Card.Title>
              <Card.Text>{user?.displayName || user?.email || "User"}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="text-center shadow-sm mb-3">
            <Card.Body>
              <Card.Title>Total Cards</Card.Title>
              <Card.Text>{userCards.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4}>
          <Card className="text-center shadow-sm mb-3">
            <Card.Body>
              <Card.Title>Email</Card.Title>
              <Card.Text>{user?.email}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center text-danger mb-3">Danger</Card.Title>
              <DeleteAccount user={user} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr />

      <h2 className="text-center mb-4">Your Card Collection</h2>
      
      {userCards.length === 0 ? (
        <p className="text-center text-muted mb-3">
          You haven't added any cards yet. Visit a set and click on cards to add them to your collection!
        </p>
      ) : (
        <Row className="g-4">
          {userCards.map((card) => (
            <Col key={card.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow">
                <Link to={`/card/${card.setId}/${card.cardId}`}>
                  <Card.Img 
                    variant="top" 
                    src={card.cardImage} 
                    alt={card.cardName}
                    style={{ objectFit: "contain", height: "250px", padding: "10px", cursor: "pointer" }}
                  />
                </Link>
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: "0.9rem" }}>{card.cardName}</Card.Title>
                  <Card.Text style={{ fontSize: "0.8rem" }} className="text-muted">
                    {card.setName} - {card.localId}
                  </Card.Text>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="mt-auto"
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
