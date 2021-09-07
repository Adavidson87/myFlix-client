import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap/Button";

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class MainView extends React.Component {

  constructor() {
    super();
    // Initial state is set to null
    this.state = {
      movies: [],
      user: null
    };
  }

  getMovies(token) {
    console.log("get movies")
    axios.get('https://myflix-cryptic-waters.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getDirectors(token) {
    console.log("get directors")
    axios.get('https://myflix-cryptic-waters.herokuapp.com/directors', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        this.setState({
          directors: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getGenres(token) {
    console.log("get genres")
    axios.get('https://myflix-cryptic-waters.herokuapp.com/genres', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        this.setState({
          genres: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');

    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
      this.getGenres(accessToken);
      this.getDirectors(accessToken);
    }
  }

  /* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  render() {
    const { movies, user, genres, directors } = this.state;

    if (!user) return <Col>
      <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
    </Col>
    if (movies.length === 0) return <div className="main-view" />;

    return (
      <Router>

        <Row className="main-view justify-content-md-center">

          <Route exact path="/" render={() => {
            return movies.map(m => (
              <Col md={3} key={m._id}>
                <MovieCard movie={m} />
              </Col>
            ))
          }} />

          <Route path="/register" render={() => {
            if (user) return <Redirect to="/" />
            return <Col>
              <RegistrationView />
            </Col>
          }} />

          <Route path="/profile" render={() => { return <Col><ProfileView movies={movies} /></Col> }} />

          <Route path="/movies/:movieId" render={({ match, history }) => {
            return <Col md={8}>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
            </Col>
          }} />

          <Route path="/directors/:name" render={({ match, history }) => {
            return <Col md={8}>
              <DirectorView director={directors.find(m => m.Name === match.params.name)} onBackClick={() => history.goBack()} />
            </Col>
          }
          } />

          <Route path="/genres/:Name" render={({ match, history }) => {
            return <Col md={8}>
              <GenreView genre={genres.find(m => m.Name === match.params.Name)} onBackClick={() => history.goBack()} />
            </Col>
          }
          } />

          <Route path="/users/:username" render={({ match, history }) => {
            return <ProfileView history={history} movies={movies} />

          }} />
        </Row>
      </Router>
    );
  }
};

export default MainView;