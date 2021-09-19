import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import './navbar-view.scss';

export class NavBar extends React.Component {


  onLoggedOut = () => {
    this.props.setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.open('/', '_self');
    console.log('logged out');
  }

  render() {
    // const { user } = this.state
    const { username, user } = this.props;

    return (

      < Navbar fixed="top" className="navBar">
        <Nav className="justify-content-center" activeKey="/home">
          <Nav.Link>Greetings {`${this.props.user}`}</Nav.Link>
          <Nav.Link as={Link} to={'/'} className="link-text">Home</Nav.Link>
          <Nav.Link as={Link} to={'/profile'} className="link-text">View Profile</Nav.Link>
          <Button variant="secondary" onClick={() => { this.onLoggedOut() }}>Logout</Button>
        </Nav>
      </Navbar >
    );
  }
}

export default Navbar;