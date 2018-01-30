import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './index.css';

function AlgoCard({ title, thumbnail, stars, description, downloads }) {
  return (
    <div className="marketplace__algo-card">
      <div
        className="marketplace__algo-card__hero-image"
        style={{ backgroundImage: `url(${thumbnail})` }}
      />
      <div className="marketplace__algo-card__content">
        <div className="marketplace__algo-card__title">{title}</div>
        <div className="marketplace__algo-card__stars">{`${stars} (${downloads})`}</div>
      </div>
    </div>
  );
}

AlgoCard.propTypes = {
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  stars: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  downloads: PropTypes.number.isRequired,
}

class Marketplace extends Component {
  static propTypes = {
    order: PropTypes.array.isRequired,
    map: PropTypes.object.isRequired,
  };

  render() {
    const { order, map } = this.props;

    return (
      <div className="marketplace">
        <div className="marketplace__header">
          <input
            className="marketplace__input"
            type="text"
            placeholder="Search for algorithmns"
          />
          <select className="marketplace__selector marketplace__selector--category">
            <option>Category</option>
          </select>
          <select className="marketplace__selector">
            <option>Stars</option>
          </select>
        </div>
        <div className="marketplace__algos-container">
          {order.map(id => AlgoCard(map[id]))}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ algorithmns: { order, map } }) => ({
    order, map,
  }),
)(Marketplace)