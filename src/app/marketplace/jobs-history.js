import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import randomColor from 'randomcolor';

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
    const nameMap = {};

    const job = jobs[jobId];

    const processed = job.results
      .reduce((list, userResults) => {
        return [
          ...list,
          ...userResults.data,
        ];
      }, [])
      .reduce((acc, data) => {
        if (data.confidence < .2) {
          return acc;
        }

        const date = new Date();
        const weeks = Math.floor(Math.random() * 8);

        date.setDate(new Date().getDate() - (weeks * 7));

        acc.push({
          name: data.name,
          date: date.toISOString().split('T')[0],
        });
        nameMap[data.name] = 0;
        return acc;
      }, [])
      .reduce((acc, { date, name }) => {
        acc[name] = acc[name] || 0;
        acc[name]++
        return acc;
      }, {});

    return (
      <div className="algo-modal__job-results-container">
        <div className="algo-modal__job-results">
          <PieChart width={780} height={500}>
            <Pie
              data={Object.entries(processed).reduce((acc, [name, count]) => {
                acc.push({ name, count });
                return acc;
              }, [])}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={5}
              lum
              fill="#8884d8"
              label={(name, value) => {
                return name.name;
              }}
            >
              {Object.keys(processed).map((_, i) => (
                <Cell key={i} fill={randomColor({ luminosity: 'dark' })} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
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
