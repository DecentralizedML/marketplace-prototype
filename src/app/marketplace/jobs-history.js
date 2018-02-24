import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

class JobsHistory extends Component {
  static propTypes = {
    algoId: PropTypes.string.isRequired,
    jobs: PropTypes.array.isRequired,
  };

  static defaultProps = {
    jobs: [],
  };

  renderJob = (job, i) => {
    return (
      <div
        key={job._id}
        className="algo-modal__job-history__job"
      >
        <div
          className="algo-modal__job-history__job__thumbnail"
          style={{ backgroundImage: `url(${job.thumbnail})`}}
        />
        <div className="algo-modal__job-history__job__title">
          {job.title}
        </div>
        <div className="algo-modal__job-history__job__results">
          {`${job.results.length} results`}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="algo-modal__job-history">
        {this.props.jobs.map(this.renderJob)}
      </div>
    );
  }
};

export default connect(
  state => ({
    jobs: [
      {
        id: '12312312312',
        title: 'Hey yo',
        thumbnail: 'http://www.polyvista.com/blog/wp-content/uploads/2015/06/sentiment-customer-exp-large.png',
        results: [1,2,3,4,5,6,7]
      },
      {
        id: '12312312312111',
        title: 'Hey yo',
        thumbnail: 'http://www.polyvista.com/blog/wp-content/uploads/2015/06/sentiment-customer-exp-large.png',
        results: [1,2,3,4,5,6,7]
      },
    ]
  }),
)(JobsHistory);
