import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { setUser } from '../../actions/actions';
import config from '../../config.js';

import './profile-view.scss'

class ProfileView extends React.Component {

  constructor() {
    super();
    this.state = {
      Username: null,
      Password: null,
      Email: null,
      Birthday: null,
      FavoriteMovies: []
    };
  }

  getUser(token) {
    const username = localStorage.getItem('user');
    axios.get(`${config.API_URL}/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
          FavoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  // removes movie from favorites list
  removeFavoriteMovie(movie) {
    const token = localStorage.getItem('token');
    const Username = localStorage.getItem('user');


    axios.delete(`${config.API_URL}/users/${Username}/movies/${movie._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        console.log('Movie was removed from list');
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  //updates user information
  handleSubmit(e) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.put(`${config.API_URL}/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        Username: this.state.Username,
        Password: this.state.Password,
        Email: this.state.Email,
        Birthday: this.state.Birthday
      },
    })
      .then((response) => {
        setUser(response.data);
        console.log(data);
        alert(user + " has been updated.");
        console.log(response);
        window.open('{`/users/${this.props.user}`}', '_self');
      })
      .catch(function (error) {
        alert(error.response.data);
      });
  }

  onChangeHandler = (e) => {
    console.log(e);
    if (e.target.name === "username") {
      this.Username = e.target.Username
    }
    if (e.target.password === "password") {
      this.Password = e.target.Password
    }
    if (e.target.email === "emal") {
      this.email = e.target.Email
    }
    if (e.target.Birthday === "birthday") {
      this.birthday = e.target.Birthday
    }
  }


  // removes user
  handleDeleteUser(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.delete(`${config.API_URL}/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        alert('Your account has been deleted.');
        window.open(`/`, '_self');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { FavoriteMovies } = this.state;
    const { movies, user } = this.props;

    return (
      < Row className="profile-view" >
        <Card bg="yellowgreen" className="profile-card" variant="top">
          <h1>Favorites Movies</h1>
          <Card.Body className="profile-cardBody">
            {FavoriteMovies.length === 0 && <div className="text-center">Empty</div>}

            <div className="favorite-movies">
              {FavoriteMovies.length > 0 &&
                movies.map((movie) => {
                  if (FavoriteMovies.includes(movie._id)) {
                    return (
                      <Card className="favorite-items-card-content" key={movie._id}>
                        <Card.Img variant="top" src={movie.ImagePath} crossOrigin="anonymous" />
                        <Card.Body>
                          <Card.Title className="movie-card-title"><Link to={`/movies/${movie._id}`}><Button variant="link">{movie.Title}</Button></Link></Card.Title>
                          <Button variant="danger" value={movie._id} onClick={() => this.removeFavoriteMovie(movie)}>Remove</Button>
                        </Card.Body>
                      </Card>
                    );
                  }
                })}
            </div>
          </Card.Body>

          <h2 className="section">Update Profile</h2>
          <Card.Body className="form-cardBody">
            <Form className="update-form" onSubmit={(e) => this.handleSubmit(e, this.Username, this.Password, this.Email, this.Birthdate)}>

              <Form.Group controlId="formUsername">
                <Form.Label className="form-label">Username</Form.Label>
                <Form.Control type="text" placeholder="Enter New Username" name='username' onChange={this.onChangeHandler} />
              </Form.Group>


              <Form.Group controlId="formPassword">
                <Form.Label className="form-label">Password:</Form.Label>
                <Form.Control type="password" placeholder="Enter New Password" name="password" onChange={this.onChangeHandler} />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label className="form-label">Email:</Form.Label>
                <Form.Control type="email" placeholder="Enter New Email" name="email" onChange={this.onChangeHandler} />
              </Form.Group>

              <Form.Group controlId="formBirthday">
                <Form.Label className="form-label">Birthday:</Form.Label>
                <Form.Control type="date" placeholder="Enter New Birthday" name="birthday" onChange={this.onChangeHandler} />
              </Form.Group>
            </Form>
          </Card.Body>

          <Button variant="primary" className="submit-button" type="submit" onClick={(e) => this.handleSubmit(e)}>Update</Button>

          {/* Deletes user */}
          <Card.Body className="delete-cardBody">
            <Button variant="danger" onClick={(e) => this.handleDeleteUser(e)}>Delete User</Button>
          </Card.Body>
        </Card>
      </Row >
    );
  }
}

ProfileView.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthdate: PropTypes.string,
    favoriteMovies: PropTypes.array
  }),
};

let mapStateToProps = state => {
  return { user: state.user, movies: state.movies }
};

export default connect(mapStateToProps, { setUser })(ProfileView);