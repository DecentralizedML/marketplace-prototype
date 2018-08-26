import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAllAlgos } from '../../ducks/algorithms';
import AlgoCard from './algo-card';

import './index.css';

class Marketplace extends Component {
  static propTypes = {
    order: PropTypes.array.isRequired,
    map: PropTypes.object.isRequired,
    fetchAllAlgos: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.fetchAllAlgos();
  }

  render() {
    const { order, map } = this.props;

    // <div className="marketplace__header">
    //   <input
    //     className="marketplace__input"
    //     type="text"
    //     placeholder="Search for algorithms"
    //   />
    //   <select className="marketplace__selector marketplace__selector--category">
    //     <option>Category</option>
    //   </select>
    //   <select className="marketplace__selector">
    //     <option>Stars</option>
    //   </select>
    // </div>
    return (
      <div className="marketplace">
        <div className="marketplace__algos-container">
          {order.map(address => (
            <AlgoCard
              key={address}
              address={address}
              { ...map[address] }
            />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ algorithms: { order, map } }) => ({
    order, map,
  }),
  dispatch => ({
    fetchAllAlgos: () => dispatch(fetchAllAlgos()),
  }),
)(Marketplace);
