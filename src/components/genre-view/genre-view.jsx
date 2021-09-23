import React from 'react';
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import './genre-view.scss';

export class GenreView extends React.Component {

  render() {
    const { genre, onBackClick } = this.props;

    return (
      <div className="genre-view">

        <div className="genre-name">
          <span className="label">{genre.Name}</span>
        </div>

        <div className="genre-discription">
          <span className="label">{genre.Description}</span>
        </div>

        <Button onClick={() => { onBackClick(null); }}>Back</Button>

      </div>
    );
  }
}

GenreView.propTypes = {
  genre: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired
  })
};

export default GenreView;