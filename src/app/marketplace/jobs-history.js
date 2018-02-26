import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  LineChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
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
    selectedCategory: '',
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
    const { jobId, selectedCategory } = this.state;
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
        })
        nameMap[data.name] = 0;
        return acc;
      }, [])
      .reduce((acc, { date, name }) => {
        acc[date] = acc[date] || {};
        acc[date][name] = acc[date][name] || 0;
        acc[date][name]++
        return acc;
      }, {})

    const processedData = Object.entries(processed)
      .reduce((acc, [ date, names ]) => {
        Object.keys(names).forEach(name => {
          acc.push({
            date,
            [`${name}_count`]: names[name],
          });
        });
        return acc;
      }, [])
      .sort((a, b) => {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        return 0;
      });

    const options = Object.keys(nameMap);

    return (
      <div className="algo-modal__job-results-container">
        <select
          onChange={e => this.setState({ selectedCategory: e.target.value })}
          defaultValue={selectedCategory || options[0]}
        >
          {options.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <div className="algo-modal__job-results">
          <LineChart
            width={730}
            height={250}
            data={processedData.filter(data => {
              const cat = selectedCategory || options[0];
              return data[`${cat}_count`] >= 0;
            })}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis type="number" dataKey={`${selectedCategory || options[0]}_count`} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone" 
              dataKey={`${selectedCategory || options[0]}_count`}
              fill="#8884d8"
            />
          </LineChart>
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
