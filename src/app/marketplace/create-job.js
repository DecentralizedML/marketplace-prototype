import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './index.css';

class CreateJob extends Component {
  static propTypes = {
  };

  render() {
    return (
      <div className="algo-modal__create-job">
        <div className="algo-modal__create-job-row">
          <div className="algo-modal__create-job-row__label">Maximum Devices</div>
          <input type="number" placeholder="0" className="algo-modal__create-job-row__input" />
        </div>
        <div className="algo-modal__create-job-row">
          <div className="algo-modal__create-job-row__label">Rewards Per Device</div>
          <input type="number" placeholder="100" className="algo-modal__create-job-row__input" />
        </div>
        <button className="algo-modal__create-job-btn">Create Job</button>
      </div>
    );
  }
}

export default connect(
)(CreateJob);
