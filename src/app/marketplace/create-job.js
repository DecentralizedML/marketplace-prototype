import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../ducks/jobs';

import './index.css';

class CreateJob extends Component {
  static propTypes = {
    algoId: PropTypes.string.isRequired,
    createJob: PropTypes.func.isRequired,
  };

  state = {
    maxDevice: '',
    rewardsPerDevice: '',
  };

  onCreateJob = () => {
    const { maxDevice, rewardsPerDevice } = this.state;
    const { algoId, createJob } = this.props;

    if (!maxDevice && !rewardsPerDevice) {
      return;
    }

    createJob({ algoId, rewardsPerDevice, maxDevice })
      .then(() => this.setState({
        maxDevice: '',
        rewardsPerDevice: '',
      }));
  } 

  render() {
    const { maxDevice, rewardsPerDevice } = this.state;
    const { isCreatingJob, createJobErrorMessage } = this.props;

    return (
      <div className="algo-modal__create-job">
        <div className="algo-modal__create-job-row">
          <div className="algo-modal__create-job-row__label">Maximum Devices</div>
          <input
            type="number"
            placeholder="10"
            className="algo-modal__create-job-row__input"
            value={maxDevice}
            onChange={e => this.setState({ maxDevice: e.target.value })}
          />
        </div>
        <div className="algo-modal__create-job-row">
          <div className="algo-modal__create-job-row__label">Rewards Per Device</div>
          <input
            type="number"
            placeholder="100"
            className="algo-modal__create-job-row__input"
            value={rewardsPerDevice}
            onChange={e => this.setState({ rewardsPerDevice: e.target.value })}
          />
        </div>
        <div className="algo-modal__create-job--error-message">{createJobErrorMessage}</div>
        <button
          className="algo-modal__create-job-btn"
          onClick={this.onCreateJob}
          disabled={!maxDevice || !rewardsPerDevice || isCreatingJob}
        >
          Create Job
        </button>
      </div>
    );
  }
}

export default connect(
  ({ jobs }) => ({
    isCreatingJob: jobs.isCreatingJob,
    createJobErrorMessage: jobs.createJobErrorMessage,
  }),
  dispatch => ({
    createJob: data => dispatch(actions.createJob(data)),
  }),
)(CreateJob);
