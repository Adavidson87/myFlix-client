import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

export class NavBar extends React.Component {


  onLoggedOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.open('/', '_self');
    this.setState({
      user: null,
      token: null
    });
  }

  render() {
    const { username, user } = this.props;

    return (

      < Navbar fixed="top">
        <Nav className="justify-content-center" activeKey="/home">
          <Nav.Link>Greetings {`${this.props.user}`}</Nav.Link>
          <Nav.Link as={Link} to={'/'} className="link-text">Home</Nav.Link>
          <Nav.Link as={Link} to={'/profile'} className="link-text">View Profile</Nav.Link>
          <Button onClick={() => { this.onLoggedOut() }}>Logout</Button>
        </Nav>
      </Navbar >
    );
  }
}

export default Navbar;