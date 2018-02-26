import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';

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

  state = {
    isShowingJobResults: false,
    jobId: '',
  }

  componentWillMount() {
    this.props.getJobHistoryByAlgo();
  }

  openJobResults(jobId) {
    this.setState({
      isShowingJobResults: true,
      jobId,
    });
  }

  renderJob = ([ jobId, job ], i) => {
    const algo = this.props.algorithmns[job.algo_id] || {}
    return (
      <div
        key={jobId}
        className="algo-modal__job-history__job"
        onClick={() => this.openJobResults(jobId)}
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

  renderJobResults() {
    const { jobId } = this.state;
    const { jobs } = this.props;
    const job = jobs[jobId];

    const processed = job.results.reduce((list, userResults) => {
      return [
        ...list,
        ...userResults.data,
      ];
    }, [])


    const cats = processed.reduce((categories, data) => {
      categories[data.name] = categories[data.name] || 0;
      categories[data.name]++;
      return categories;
    }, {});

    const data = Object.entries(cats).map(([ name, count ]) => ({ name, count }));

    return (
      <div className="algo-modal__job-results-container">
        <div className="algo-modal__job-results">
          <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" allowDataOverflow/>
            <YAxis dataKey="count" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
        <button
          className="algo-modal__job-results__back-btn"
          onClick={() => this.setState({ isShowingJobResults: false, jobId: '' })}
        >
          Back
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="algo-modal__job-history">
        {
          this.state.isShowingJobResults
            ? this.renderJobResults()
            : this.renderJobs()
        }
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
