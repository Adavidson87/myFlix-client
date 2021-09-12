import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Link } from "react-router-dom";

export class ProfileView extends React.Component {
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

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }


  // get user method
  getUser(token) {
    const username = localStorage.getItem('user');
    axios.get(`https://myflix-cryptic-waters.herokuapp.com/users/${username}`, {
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

  // removes movie from favorites list
  removeFavoriteMovie(movie) {
    const token = localStorage.getItem('token');
    const Username = localStorage.getItem('user');


    axios.delete(`https://myflix-cryptic-waters.herokuapp.com/users/${Username}/movies/${movie._id}`, {
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
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("user");

      axios.put(`https://myflix-cryptic-waters.herokuapp.com/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` }, 
          data: {
            Username: this.state.Username,
            Password: this.state.Password,
            Email: this.state.Email,
            Birthday: this.state.Birthday
          },
      })
       .then((response) => {
              const data = response.data;
              console.log(data);
              alert(user + " has been updated.");
              console.log(response);
              window.open('{`/users/${this.props.user}`}', '_self');
          })
          .catch(function (error) {
              alert(error.response.data);
          });
        }

  setUsername(input) {
    this.Username = input;
  }

  setPassword(input) {
    this.Password = input;
  }

  setEmail(input) {
    this.Email = input;
  }

  setBirthday(input) {
    this.Birthday = input;
  }


  // removes user
  handleDeleteUser(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.delete(`https://myflix-cryptic-waters.herokuapp.com/users/${username}`, {
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
    const { movies } = this.props;

    return (
      <Row className="profile-view">
        <Card className="profile-card" variant="top">
          <h2>Favorites Movies</h2>
          <Card.Body>
            {FavoriteMovies.length === 0 && <div className="text-center">Empty</div>}

            <div className="favorite-movies">
              {FavoriteMovies.length > 0 &&
                movies.map((movie) => {
                  if (FavoriteMovies.includes(movie._id)) {
                    return (
                      <Card className="favorite-items-card-content" key={movie._id}>
                        <Card.Img className="movieCard" variant="top" src={movie.ImagePath} crossOrigin="anonymous" />
                        <Card.Body>
                          <Card.Title className="movie-card-title"><Link to={`/movies/${movie._id}`}><Button variant="link">{movie.Title}</Button></Link></Card.Title>
                          <Button value={movie._id} onClick={() => this.removeFavoriteMovie(movie)}>Remove</Button>
                        </Card.Body>
                      </Card>
                    );
                  }
                })}
            </div>
          </Card.Body>

          <h1 className="section">Update Profile</h1>
          <Card.Body>
            <Form className="update-form" onSubmit={(e) => this.handleSubmit(e, this.Username, this.Password, this.Email, this.Birthdate)}>

              <Form.Group controlId="formUsername">
                <Form.Label className="form-label">Username</Form.Label>
                <Form.Control type="text" placeholder="Enter New Username" onChange={(e) => this.setUsername(e.target.value)} />
              </Form.Group>


              <Form.Group controlId="formPassword">
                <Form.Label className="form-label">Password:</Form.Label>
                <Form.Control type="password" placeholder="Enter New Password" onChange={(e) => this.setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label className="form-label">Email:</Form.Label>
                <Form.Control type="email" placeholder="Enter New Email" onChange={(e) => this.setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group controlId="formBirthday">
                <Form.Label className="form-label">Birthday:</Form.Label>
                <Form.Control type="date" placeholder="Enter New Birthday" onChange={(e) => this.setBirthday(e.target.value)} />
              </Form.Group>

              <Button variant="primary" type="submit" onClick={(e) => this.handleSubmit(e)}>Update</Button>

              <h3>Delete User</h3>
              <Card.Body>
                <Button onClick={(e) => this.handleDeleteUser(e)}>Delete User</Button>
              </Card.Body>
            </Form>

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
    FavoriteMovies: PropTypes.array
  }),
};

export default ProfileView;