import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

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
      directors: [],
      genres: [],
      user: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');

    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  getUsers(token) {
    console.log("get users")
    axios.get('https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          users: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getMovies(token) {
    console.log("get movies")
    axios.get('https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/movies', {
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
    axios.get('https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/directors/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(respons => {
        this.setState({
          directors: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getGenres(token) {
    console.lgo("get genres")
    axios.get('https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/genres/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          genres: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
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
    const { movies, user, username } = this.state;
    return (
      <Router>

        <Row className="main-view justify-content-md-center">

          <Route exact path="/" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
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

          <Route path="/profile" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            <Col>
              <ProfileView />
            </Col>
          }} />

          <Route path="/movies/:movieId" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
            </Col>
          }} />

          <Route path="/directors/:Name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
            </Col>
          }
          } />

          <Route path="/genres/:Name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
            </Col>
          }
          } />

          <Route path="/users/:username" render={({ match, history }) => {
            if (!user) return <LoginView onLoggedIn={(data) => this.onLoggedIn(data)} />;
            if (movies.length === 0) return;
            return <ProfileView history={history} movies={movies} />

          }} />
        </Row>
      </Router>
    );
  }
};

export default MainView;