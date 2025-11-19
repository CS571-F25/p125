import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router';

function PrimaryNav() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className="d-flex justify-content-center">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav className="gap-5">
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
          <Navbar.Brand as={Link} to="/">
            PokéVault
          </Navbar.Brand>
          <Nav.Link as={Link} to="/account">
            Account
          </Nav.Link>
        </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default PrimaryNav;
