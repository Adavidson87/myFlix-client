import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

import './movie-card.scss'

export class MovieCard extends React.Component {
  render() {
    const { movie, onMovieClick } = this.props;
    return (
      <Card className="movie-card">
        <Card.Img className='movie-card-image' variant="top" src={movie.ImagePath} crossOrigin="anonymous" />
        <Card.Body className="movie-card-body">
          <Card.Title className="movie-card-title">{movie.Title}</Card.Title>
          <Card.Text className="movie-card-text">{movie.Description}</Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button variant="info">Open</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string
  }).isRequired
  // onMovieClick: PropTypes.func.isRequired
};