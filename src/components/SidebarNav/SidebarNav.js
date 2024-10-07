import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../../App.css";

function SidebarNav() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar sticky-top">
      <Container fluid>
        <Navbar.Brand href="./" className="navbar-brand">
          Easy Expense
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="./" className="nav-link">
              Home
            </Nav.Link>
            <Nav.Link href="#expenses" className="nav-link">
              Expense
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link href="" className="nav-link">
              Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SidebarNav;
