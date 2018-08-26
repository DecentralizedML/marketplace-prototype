import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
} from 'recharts';
import randomColor from 'randomcolor';

import * as actions from '../../ducks/jobs';
import { processDataForTimeSeries, processDataForPie } from '../../utils/results';

const GRAPH_TYPES = {
  TIME_SERIES: 'time_series',
  PIE: 'pie',
};

class JobsHistory extends Component {
  static propTypes = {
    algoId: PropTypes.string.isRequired,
    jobs: PropTypes.object.isRequired,
    algorithms: PropTypes.object.isRequired,
  };

  static defaultProps = {
    jobs: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingJobResults: false,
      graphType: GRAPH_TYPES.PIE,
      selectedName: '',
      jobId: '',
    };

    this.processDataForTimeSeries = _.memoize(this.processDataForTimeSeries);
    this.processDataForPie = _.memoize(this.processDataForPie);
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

  processDataForPie = jobId => {
    const { jobs } = this.props;
    const job = jobs[jobId];

    return processDataForPie(job);
  }

  processDataForTimeSeries = jobId => {
    const { jobs } = this.props;
    const job = jobs[jobId];

    return processDataForTimeSeries(job);
  }

  renderGraphTypesSelector() {
    return (
      <select onChange={e => this.setState({ graphType: e.target.value })}>
        <option value={GRAPH_TYPES.PIE}>Pie Chart</option>
        <option value={GRAPH_TYPES.TIME_SERIES}>Line Chart</option>
      </select>
    );
  }

  renderJob = ([ jobId, job ], i) => {
    const algo = this.props.algorithms[job.algo_id] || {}
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

  renderPie() {
    const { jobId } = this.state;
    const { data } = this.processDataForPie(jobId);

    return (
      <div className="algo-modal__job-results-container">
        { this.renderGraphTypesSelector() }
        <div className="algo-modal__job-results">
          <PieChart width={600} height={300}>
            <Pie
              data={data}
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
              {Object.keys(data).map((_, i) => (
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

  renderLines(allNames) {
    const { selectedName } = this.state;

    if (selectedName) {
      return (
        <Line
          key={selectedName}
          type="monotone"
          dataKey={selectedName}
          stroke={randomColor({ luminosity: 'dark' })}
        />
      );
    }

    return Object.keys(allNames)
      .map(name => (
        <Line
          key={name}
          type="monotone"
          dataKey={name}
          stroke={randomColor({ luminosity: 'dark' })}
        />
      ));
  }

  renderTimeSeries() {
    const { selectedName, jobId } = this.state;
    const { allNames, data } = this.processDataForTimeSeries(jobId);

    return (
      <div className="algo-modal__job-results-container">
        { this.renderGraphTypesSelector() }
        <div className="algo-modal__job-results">
          <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis minTickGap={1} />
            <Tooltip />
            <Legend onClick={e => {
              this.setState({
                selectedName: selectedName ? '' : e.dataKey,
              })}
            } />
            {this.renderLines(allNames)}
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

  renderJobResults() {
    const { graphType } = this.state;

    switch (graphType) {
      case GRAPH_TYPES.TIME_SERIES:
        return this.renderTimeSeries();
      case GRAPH_TYPES.PIE:
      default:
        return this.renderPie();
    }
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
      algorithms: state.algorithms.map,
    };
  },
  (dispatch, { algoId }) => ({
    getJobHistoryByAlgo: () => dispatch(actions.getJobHistoryByAlgo(algoId)),
  }),
)(JobsHistory);
