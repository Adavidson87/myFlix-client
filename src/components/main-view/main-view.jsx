import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { setMovies, setUser, setDirectors, setGenres } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';

import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { RegistrationView } from '../registration-view/registration-view';
import ProfileView from '../profile-view/profile-view';
import { NavBar } from '../navbar-view/navbar-view';
import config from '../../config.js';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './main-view.scss';

class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      user: null
    }
  }

  getMovies(token) {
    axios.get(`${config.API_URL}/movies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUser(token) {
    const username = localStorage.getItem('user');
    axios.get(`${config.API_URL}/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        this.props.setUser(response.data);
        // console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getDirectors(token) {
    axios.get(`${config.API_URL}/directors`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setDirectors(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getGenres(token) {
    axios.get(`${config.API_URL}/genres`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setGenres(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    let user = localStorage.getItem('user');

    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getUser(accessToken);
      this.getMovies(accessToken);
      this.getGenres(accessToken);
      this.getDirectors(accessToken);
    }
  }

  /* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/

  onLoggedIn(authData) {
    console.log(authData);
    this.props.setUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
    this.getUser(authData.token);
  }

  render() {
    let { movies, genres, directors } = this.props;
    const { user } = this.state;

    return (
      <Router>

        <Row className="main-view justify-content-md-center flex-wrap">

          <NavBar user={user} />

          <Route exact path="/" render={() => {
            if (!user)
              return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <MoviesList />;
          }} />

          <Route path="/register" render={() => {
            if (user)
              return <Redirect to="/" />
            else {
              return <Col>
                <RegistrationView />
              </Col>
            }
          }} />

          <Route path="/profile" render={() => {
            if (!user)
              return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col>
              <ProfileView />
            </Col>
          }} />

          <Route path="/movies/:movieId" render={({ match, history }) => {
            if (!user)
              return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
            </Col>
          }} />

          <Route path="/directors/:Name" render={({ match, history }) => {
            if (!user)
              return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <DirectorView director={directors.find(m => m.Name === match.params.Name)} onBackClick={() => history.goBack()} />
            </Col>
          }
          } />

          <Route path="/genres/:Name" render={({ match, history }) => {
            if (!user)
              return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <GenreView genre={genres.find(m => m.Name === match.params.Name)} onBackClick={() => history.goBack()} />
            </Col>
          }
          } />
        </Row>
      </Router>
    );
  }
}

let mapStateToProps = state => {
  return { movies: state.movies, genres: state.genres, directors: state.directors, user: state.user }
}

export default connect(mapStateToProps, { setMovies, setDirectors, setGenres, setUser })(MainView);