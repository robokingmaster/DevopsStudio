// src/components/Navbar.js
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import '../css-styles/navbar.css';

import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';

const API = require('../api')
const backendurl = process.env.REACT_APP_BACKEND_API_BASE

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Navbar User:', user);

  if (!user) {
    navigate('/');
  }

  const handleLogoff = () => {
    logout();
    Cookies.remove('user');
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">User Managment</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-center">
          <Nav className="mx-auto">
            <Nav.Link href="/dashboard">Home</Nav.Link>
            <Nav.Link href="/showusers">Users</Nav.Link>  
            <NavDropdown title="More" id="nav-dropdown">
              <NavDropdown.Item href="/about">About Us</NavDropdown.Item>
              <NavDropdown.Item href="/contact">Contact</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="justify-content-right">
             <div className="navbar-userprofile">
                <Nav.Link href="/dashboard">
                  <img src={user.profile_image ? `${backendurl}/uploads/${user.profile_image}` : `${backendurl}/uploads/default.jpeg`}
                      alt="Profile"
                      style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '10px' }}
                  />
                </Nav.Link>
                <span><Nav.Link href="/dashboard">{user.fullname}</Nav.Link></span>                 
                <Button onClick={handleLogoff} style={{ marginLeft: '10px' }}>Logoff</Button>
             </div>   
          </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
  );

};

export default AppNavbar;
