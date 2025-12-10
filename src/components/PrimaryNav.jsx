import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function PrimaryNav({ user, onLogout }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ backgroundColor: '#f8f9fa', minHeight: '60px' }}>
      <Container className="position-relative">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="gap-5">
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/wishlist">
              Wishlist
            </Nav.Link>
            <Navbar.Brand as={Link} to="/">
              PokéVault
            </Navbar.Brand>
            <Nav.Link as={Link} to="/account">
              Account
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {user && (
          <button className="btn btn-danger position-absolute end-0" onClick={onLogout} style={{ top: '50%', transform: 'translateY(-50%)' }}>
            Logout
          </button>
        )}
      </Container>
    </Navbar>
  );
}

export default PrimaryNav;
