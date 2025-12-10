import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

/**
 * About page component
 *
 * Displays information about PokéVault
 */
export default function AboutMe() {
    return (
        <Container className="p-4" style={{ maxWidth: "1200px" }}>
            <div className="text-center mb-4">
                <h1 className="mb-4" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                    About PokéVault
                </h1>

                <p className="mb-5" style={{ fontSize: "1.125rem", color: "#374151", lineHeight: "1.75" }}>
                    PokéVault is your ultimate Pokémon card collection manager. 
                    Organize your collection, track your wishlist, and explore detailed 
                    card information with market prices all in one place!
                </p>
            </div>

            <Row className="g-4 mt-4">
                {/* Box 1 - How to Use */}
                <Col md={6}>
                    <Card 
                        className="h-100 shadow" 
                        style={{ 
                            border: "4px solid #fca5a5", 
                            borderRadius: "1rem",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <Card.Body className="d-flex flex-column">
                            <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
                                How to Use PokéVault
                            </Card.Title>
                            <Card.Text style={{ color: "#374151", lineHeight: "1.75" }}>
                                Browse through Pokémon card sets, click on any card to view detailed 
                                information including market prices. Add cards to your collection or 
                                wishlist. Track your collection progress and manage 
                                your wanted cards from your account dashboard.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Box 2 - Card Data */}
                <Col md={6}>
                    <Card 
                        className="h-100 shadow" 
                        style={{ 
                            border: "4px solid #67e8f9", 
                            borderRadius: "1rem",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <Card.Body className="d-flex flex-column">
                            <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
                                Card Data
                            </Card.Title>
                            <Card.Text style={{ color: "#374151", lineHeight: "1.75" }}>
                                We get our card data and market prices from TCGdex API and TCGPlayer. 
                                This provides you with accurate, up-to-date information on card details, 
                                pricing, and availability. All card images and information are sourced 
                                directly from official Pokémon TCG databases.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Box 3 - Who We Are */}
                <Col md={6}>
                    <Card 
                        className="h-100 shadow" 
                        style={{ 
                            border: "4px solid #6ee7b7", 
                            borderRadius: "1rem",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <Card.Body className="d-flex flex-column">
                            <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
                                Who We Are
                            </Card.Title>
                            <Card.Text style={{ color: "#374151", lineHeight: "1.75" }}>
                                PokéVault was created by a student for a class Project for CS571 at UW-Madison.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Box 4 - Your Account */}
                <Col md={6}>
                    <Card 
                        className="h-100 shadow" 
                        style={{ 
                            border: "4px solid #c4b5fd", 
                            borderRadius: "1rem",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <Card.Body className="d-flex flex-column">
                            <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
                                Your Account
                            </Card.Title>
                            <Card.Text style={{ color: "#374151", lineHeight: "1.75" }}>
                                You need to sign in with Google to use PokéVault. We use Firebase 
                                for authentication and data storage. Your collection data is securely 
                                stored and only accessible to you. We do not share any personal 
                                information with third parties.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}