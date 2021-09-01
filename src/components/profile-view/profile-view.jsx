import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap';

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
    axios.get(`https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/users/${username}`, {
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


  removeFavoriteMovie() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');


    axios.delete(`https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/users/${username}/movies/${movie._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        console.log('Movie was removed from list');
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  handleUpdate(e, newUsername, newPassword, newEmail, newBirthdate) {
    this.setState({
      validated: null,
    });

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        validated: true,
      });
      return;
    }
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.put(`https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        Username: newUsername ? newUsername : this.state.Username,
        Password: newPassword ? newPassword : this.state.Password,
        Email: newEmail ? newEmail : this.state.Email,
        Birthdate: newBirthdate ? newBirthdate : this.state.Birthdate,
      },
    })
      .then((response) => {
        console.log('Changes saved')
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthdate: response.data.Birthdate,
        });
        localStorage.setItem('user', this.state.Username);
        window.open(`/users/${username}`, '_self');
      })
      .catch(function (error) {
        console.log(error);
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

  setBirthdate(input) {
    this.Birthdate = input;
  }

  handleDeleteUser(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.delete(`https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/users/${username}`, {
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
        <Card className="profile-card">
          <h2>Favorites Movies</h2>
          <Card.Body>
            {FavoriteMovies.length === 0 && <div className="text-center">Empty</div>}

            <div className="favorite-movies">
              {FavoriteMovies.length > 0 &&
                movies.map((movie) => {
                  if (movie._id === FavoriteMovies.find((favoriteMovie) => favoriteMovie === movie._id)) {
                    return (
                      <Card className="favorite-items-card-content" key={movie._id}>
                        <Card.Img className="movieCard" variant="top" src={movie.ImageURL} />
                        <Card.Body>
                          <Card.Title className="movie-card-title">{movie.Title}</Card.Title>
                          <Button value={movie._id} onClick={(e) => this.removeFavouriteMovie(e, movie)}>
                            Remove
                          </Button>
                        </Card.Body>
                      </Card>
                    );
                  }
                })}
            </div>
          </Card.Body>

          <h1 className="section">Update Profile</h1>
          <Card.Body>
            <Form className="update-form" onSubmit={(e) => this.handleUpdate(e, this.Username, this.Password, this.Email, this.Birthdate)}>

              <Form.Group controlId="formUsername">
                <Form.Label className="form-label">Username:</Form.Label>
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
                <Form.Control type="date" placeholder="Enter New Birthdate" onChange={(e) => this.setBirthdate(e.target.value)} />
              </Form.Group>

              <Button type="submit">Update</Button>

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