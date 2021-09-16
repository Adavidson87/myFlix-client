import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { setMovies } from '../../actions/actions';
import MoviesList from '../movies-list/movies-list';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import { NavBar } from '../navbar-view/navbar-view';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class MainView extends React.Component {

  constructor() {
    super();
    // Initial state is set to null
    this.state = {
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
        this.props.setMovies(response.data);
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
    let { movies } = this.props;
    const { user, genres, directors } = this.state;

    return (
      <Router>

        <Row className="main-view justify-content-md-center">

          <NavBar user={user} />

          <Route exact path="/" render={() => {
            if (!user)
              return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <MoviesList movies={movies} />;
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
              <ProfileView movies={movies} />
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
  return { movies: state.movies }
}

export default connect(mapStateToProps, { setMovies } ) (MainView);