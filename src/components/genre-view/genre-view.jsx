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
    console.log("get genres")
    axios.get('https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/genres', {
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

  render() {
    const { genre, onBackClick } = this.props;

    return (
      <div className="genre-view">

        <div className="genre-name">
          <span className="label">Name: </span>
          <span className="value">{genre.Name}</span>
        </div>

        <div className="genre-discription">
          <span className="label">Description: </span>
          <span className="value">{genre.Description}</span>
        </div>

        <button onClick={() => { onBackClick(null); }}>Back</button>

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