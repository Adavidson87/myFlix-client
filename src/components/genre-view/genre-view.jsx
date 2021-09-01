import React from 'react';
import PropTypes from "prop-types";
export class GenreView extends React.Component {

  keypressCallback(event) {
    console.log(event.key);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.keypressCallback);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.keypressCallback);
  }

  getGenres(token) {
    console.lgo("get genres")
    axios.get('https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/genres/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          Name: response.data.Name,
          Description: response.data.Description
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { genre, movie, onBackClick } = this.props;

    return (
      <div className="genre-view">

        <div className="genre-name">
          <span className="label">Name: {genre.Name}</span>
        </div>

        <div className="genre-discription">
          <span className="label">Description: {genre.Description}</span>
        </div>

        <div className="genre-id">
          <span className="label">Genre ID: {genre._id}</span>
        </div>

        <button onClick={() => { onBackClick(null); }}>Back</button>

      </div>
    );
  }
}

GenreView.propTypes = {
  genre: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Id: PropTypes.string
  })
};

export default GenreView;