import React from 'react';
import PropTypes from "prop-types";
export class DirectorView extends React.Component {

  keypressCallback(event) {
    console.log(event.key);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.keypressCallback);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.keypressCallback);
  }

  getDirectors(token) {
    console.log("get directors")
    axios.get('https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com/directors/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          director: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {
    const { movie, director, onBackClick } = this.props;

    return (
      <div className="director-view">

        <div className="director-name">
          <span className="label">Name: {director.Name}</span>
        </div>

        <div className="director-bio">
          <span className="label">Bio: {director.Bio}</span>
        </div>

        <div className="director-birth">
          <span className="label">Birthday: {director.Birth}</span>
        </div>

        <div className="director-death">
          <span className="label">Died: {director.Beath}</span>
        </div>

        <div className="director-id">
          <span className="label">Director ID: {director._id}</span>
        </div>

        <button onClick={() => { onBackClick(null); }}>Back</button>

      </div>
    );
  }
}

DirectorView.propTypes = {
  director: PropTypes.shape({
    Name: PropTypes.string,
    Bio: PropTypes.string,
    Birth: PropTypes.instanceOf(Date),
    Death: PropTypes.instanceOf(Date)
  })
};

export default DirectorView;