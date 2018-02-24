import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as actions from '../../ducks/jobs';

class JobsHistory extends Component {
  static propTypes = {
    algoId: PropTypes.string.isRequired,
    jobs: PropTypes.object.isRequired,
    algorithmns: PropTypes.object.isRequired,
  };

  static defaultProps = {
    jobs: {},
  };

  componentWillMount() {
    this.props.getJobHistoryByAlgo();
  }

  renderJob = ([ jobId, job ], i) => {
    const algo = this.props.algorithmns[job.algo_id] || {}
    return (
      <div
        key={jobId}
        className="algo-modal__job-history__job"
      >
        <div
          className="algo-modal__job-history__job__thumbnail"
          style={{ backgroundImage: `url(${algo.thumbnail})`}}
        />
        <div className="algo-modal__job-history__job__title">
          {algo.title}
        </div>
        <div className="algo-modal__job-history__job__results">
          {`${job.results.length} results`}
        </div>
      </div>
    );
  }

  renderJobs() {
    const { jobs } = this.props;

    if (!Object.keys(jobs).length) {
      return 'You have not created any job for this algorithm.';
    }

    return Object.entries(this.props.jobs).map(this.renderJob);
  }

  render() {
    return (
      <div className="algo-modal__job-history">
        {this.renderJobs()}
      </div>
    );
  }
};

export default connect(
  (state, { algoId }) => {
    return {
      jobs: state.jobs.byAlgo[algoId],
      algorithmns: state.algorithmns.map,
    };
  },
  (dispatch, { algoId }) => ({
    getJobHistoryByAlgo: () => dispatch(actions.getJobHistoryByAlgo(algoId)),
  }),
)(JobsHistory);
