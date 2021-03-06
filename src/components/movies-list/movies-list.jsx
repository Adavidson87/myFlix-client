import React from 'react';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import { MovieCard } from '../movie-card/movie-card';
import './movies-list.scss'

const mapStateToProps = state => {
  const { visibilityFilter, movies } = state;
  return { visibilityFilter, movies };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter(m => m.Title.toLowerCase().includes(visibilityFilter.toLowerCase()));
  }

  if (!movies) return <div className="main-view" />;

  return <>
    <Col className='visibility-filter-class' md={12} style={{ margin: '1em' }}>
      <VisibilityFilterInput visbilityFilter={visibilityFilter} />
    </Col>
    {filteredMovies.map(m => (
      <Col md={3} key={m._id} className="movie-list">
        <MovieCard movie={m} className="movie-list-item" />
      </Col>
    ))};
  </>;
}

export default connect(mapStateToProps)(MoviesList);