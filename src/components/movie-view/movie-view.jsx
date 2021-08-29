import React from 'react';
import PropTypes from "prop-types";
import { generatePath } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
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

    axios.post(`https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/users/${username}/movies/${this.props.movie._id}`, {}, {
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
      <div className="movie-view">

        <div className="movie-poster">
          <img src={movie.ImagePath} />
        </div>

        <div className="movie-title">
          <span className="label">Title: </span>
          <span className="value">{movie.Title}</span>
        </div>

        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>

        <div className="movie-genre">
          <span className="label">Genre: </span>
          <span className="value">{movie.Genre}</span>
          <Link to={`/genres/${movie.Genre}`}>
            <button variant="link">Open</button>
          </Link>
        </div>

        <div className="movie-director">
          <span className="label">Director: </span>
          <span className="value">{movie.Director}</span>
          <Link to={`/directors/${movie.Director}`}>
            <button variant="link">Open</button>
          </Link>
        </div>

        <button className="favorite-button" value={movie._id} onClick={(e) => this.addFavorite(e, movie)}>Add to Favorites</button>

        <button onClick={() => { onBackClick(null); }}>Back</button>

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