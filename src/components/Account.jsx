import PokeSets from "./PokeSets";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function Account() {
  // Mock data placeholders
  const user = {
    name: "John Doe",
    totalCards: 152,
    totalValue: "$1,234.56",
    favoriteSet: "Sword & Shield – Darkness Ablaze",
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Account Overview</h1>

      <Row className="mb-4">
        <Col md={6} lg={3}>
          <Card className="text-center shadow-sm mb-3">
            <Card.Body>
              <Card.Title>User Name</Card.Title>
              <Card.Text>{user.name}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="text-center shadow-sm mb-3">
            <Card.Body>
              <Card.Title>Total Cards</Card.Title>
              <Card.Text>{user.totalCards}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="text-center shadow-sm mb-3">
            <Card.Body>
              <Card.Title>Total Value</Card.Title>
              <Card.Text>{user.totalValue}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="text-center shadow-sm mb-3">
            <Card.Body>
              <Card.Title>Favorite Set</Card.Title>
              <Card.Text>{user.favoriteSet}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      <hr />

      <h2 className="text-center mb-4">Your Card Collection</h2>
      <p className="text-center text-muted mb-3">
        (This will display your card collection in future implementation)
      </p>

      {/* Placeholder for future PokeSets or CardGrid */}
      <PokeSets />
    </Container>
  );
}
