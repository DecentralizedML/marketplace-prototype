import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import countries from 'country-list';
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
    const list = countries().getNameList();

    return (
      <div className="algo-modal__create-job">
        <div className="algo-modal__create-job-rows">
          <div className="algo-modal__create-job-row">
            <div className="algo-modal__create-job-row__label">Maximum Devices</div>
            <input
              type="number"
              placeholder="e.g. 50000"
              className="algo-modal__create-job-row__input"
              value={maxDevice}
              onChange={e => this.setState({ maxDevice: e.target.value })}
            />
          </div>
          <div className="algo-modal__create-job-row">
            <div className="algo-modal__create-job-row__label">Rewards Per Device</div>
            <input
              type="number"
              placeholder="e.g. 1"
              className="algo-modal__create-job-row__input"
              value={rewardsPerDevice}
              onChange={e => this.setState({ rewardsPerDevice: e.target.value })}
            />
          </div>
          <div className="algo-modal__create-job-row">
            <div className="algo-modal__create-job-row__label">Geographic Area</div>
            <select
              className="algo-modal__create-job-row__input"
              style={{ textTransform: 'capitalize' }}
              defaultValue="hong kong"
            > 
              <option />
              {Object.keys(list).map(name => (
                <option
                  key={list[name]}
                  value={name}
                  style={{ textTransform: 'capitalize' }}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="algo-modal__create-job-row">
            <div className="algo-modal__create-job-row__label">From Date</div>
            <input
              type="date"
              className="algo-modal__create-job-row__input"
            />
          </div>
          <div className="algo-modal__create-job-row">
            <div className="algo-modal__create-job-row__label">To Date</div>
            <input
              type="date"
              className="algo-modal__create-job-row__input"
            />
          </div>
          <div className="algo-modal__create-job-row algo-modal__create-job-row--total">
            <div className="algo-modal__create-job-row__label">Estimated Total</div>
            <div className="algo-modal__create-job-row__total">
              {`${(!maxDevice || !rewardsPerDevice) ? ' - ' : (maxDevice * rewardsPerDevice)} DML`}
            </div>
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
