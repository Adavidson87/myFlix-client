import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

export class DirectorView extends React.Component {

  render() {
    const { director, onBackClick } = this.props;

    return (
      <div className="director-view">

        <div className="director-name">
          <span className="value">Name: {director.Name}</span>
        </div>

        <div className="director-bio">
          <span className="value">Bio: {director.Bio}</span>
        </div>

        <div className="director-birthdate">
          <span className="value">Born: {director.Birth}</span>
        </div>

        <div className="director-death">
          <span className="value">Died: {director.Death}</span>
        </div>

        <Button onClick={() => { onBackClick(null); }}>Back</Button>

      </div>
    );
  }
}

DirectorView.propTypes = {
  director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birth: PropTypes.string.isRequired,
    Death: PropTypes.string
  })
};

export default DirectorView;