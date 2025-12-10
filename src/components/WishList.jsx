import { useEffect, useState } from "react";
import { Link } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function WishList({ user }) {
  const [wishListCards, setWishListCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchWishListCards = async () => {
      try {
        console.log("Fetching wishlist cards for user:", user.uid);
        const cardsRef = collection(db, "wishList");
        const q = query(cardsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const cards = [];
        querySnapshot.forEach((doc) => {
          cards.push({ id: doc.id, ...doc.data() });
        });
        
        console.log("Fetched wishlist cards:", cards.length);
        
        // Sort by most recently added
        cards.sort((a, b) => b.addedAt?.seconds - a.addedAt?.seconds);
        setWishListCards(cards);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist cards:", error);
        setLoading(false);
      }
    };

    fetchWishListCards();
  }, [user]);

  const handleRemoveCard = async (cardDocId) => {
    try {
      console.log("Removing card from wishlist with ID:", cardDocId);
      await deleteDoc(doc(db, "wishList", cardDocId));
      setWishListCards(wishListCards.filter(card => card.id !== cardDocId));
      console.log("Card removed from wishlist successfully");
    } catch (error) {
      console.error("Error removing card from wishlist:", error);
      alert(`Error removing card: ${error.message}`);
    }
  };

  const handleMarkAsOwned = async (card) => {
    try {
      // Check if card already exists in user's collection
      const cardsRef = collection(db, "userCards");
      const q = query(
        cardsRef,
        where("userId", "==", user.uid),
        where("cardId", "==", card.cardId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert(`${card.cardName} is already in your collection!`);
        return;
      }

      // Add to collection
      const { addDoc } = await import("firebase/firestore");
      await addDoc(collection(db, "userCards"), {
        userId: user.uid,
        cardId: card.cardId,
        cardName: card.cardName,
        cardImage: card.cardImage,
        setId: card.setId,
        setName: card.setName,
        localId: card.localId,
        addedAt: new Date(),
      });

      // Remove from wishlist
      await deleteDoc(doc(db, "wishList", card.id));
      setWishListCards(wishListCards.filter(c => c.id !== card.id));
      
      alert(`${card.cardName} moved to your collection!`);
    } catch (error) {
      console.error("Error marking card as owned:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading your wishlist...</div>;
  }

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">My Wishlist</h1>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="text-center shadow-sm mb-3">
            <Card.Body>
              <Card.Title>Total Wanted Cards</Card.Title>
              <Card.Text>
                <h2>{wishListCards.length}</h2>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr />

      <h2 className="text-center mb-4">Wanted Cards</h2>
      
      {wishListCards.length === 0 ? (
        <p className="text-center text-muted mb-3">
          You haven't added any cards to your wishlist yet. Visit a set and add cards you want to collect!
        </p>
      ) : (
        <Row className="g-4">
          {wishListCards.map((card) => (
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
                    variant="success" 
                    size="sm" 
                    className="mb-2"
                    onClick={() => handleMarkAsOwned(card)}
                  >
                    Mark as Owned
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    Remove from Wishlist
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
