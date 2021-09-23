import React from 'react';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import config from '../../config.js';


import './movie-view.scss';

export class MovieView extends React.Component {

  keypressCallback(event) {
    console.log(event.key);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.keypressCallback);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.keypressCallback);
  }

  addFavorite() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    axios.post(`${config.API_URL}/users/${username}/movies/${this.props.movie._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        alert('Added to Favorites')
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    const { movie, onBackClick } = this.props;



    return (
      <div className="movie-view" >

        <div className="movie-poster">
          <img src={movie.ImagePath} crossOrigin="anonymous" />
        </div>

        <div className="movie-view-info">

          <div className="movie-title">
            <span className="label">{movie.Title}</span>
          </div>

          <div className="movie-description">
            <span className="label"></span>
            <span className="value">{movie.Description}</span>
          </div>

          <div className="movie-genre">
            <span className="label">Genre: </span>
            <Link to={`/genres/${movie.Genre}`}>
              <Button className="movie-view-button" variant="link">{movie.Genre}</Button>
            </Link>
          </div>

          <div className="movie-director">
            <span className="label" >Director: </span>
            <Link to={`/directors/${movie.Director}`}>
              <Button variant="link">{movie.Director}</Button>
            </Link>
          </div>

          <Button variant="success" className="favorite-button" value={movie._id} onClick={(e) => this.addFavorite(e, movie)}>Add to Favorites</Button>

          <Button variant="primary" onClick={() => { onBackClick(null); }}>Back</Button>

        </div>

      </div>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Director: PropTypes.string.isRequired,
    Genre: PropTypes.string.isRequired
  })
};

export default MovieView;