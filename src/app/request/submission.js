import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import PropTypes from 'prop-types';
// import * as actions from '../../ducks/bounties';

import './submission.css';

class Submission extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    submissions: PropTypes.array,
  };

  static defaultProps = {
    submissions: [1,1,1,1,1,1,1,1,1,1,1,1,1],
  }

  state = {
    activeTab: 0,
  };

  renderRows() {
    const { submissions } = this.props;

    if (!submissions.length) {
      return (
        <div className="submission__empty-results">
          No Results
        </div>
      );
    }

    return submissions.map(submission => (
      <div className="submission__row">
        <div className="submission__cell submission__cell--sender">
          0x0cf13...b4hu
        </div>
        <div className="submission__cell submission__cell--timestamp">
          12/25/2018 16:30
        </div>
        <div className="submission__cell submission__cell--result">
          <button>Download Result</button>
        </div>
      </div>
    ));
  }

  render() {
    const { submissions } = this.props;

    return (
      <div className="submission">
        <div className="submission__tabs">
          <div
            className={classnames('submission__tab', {
              'submission__tab--active': this.state.activeTab === 0,
            })}
            onClick={() => this.setState({ activeTab: 0 })}
          >
            {`All (${submissions.length})`}
          </div>
          <div
            className={classnames('submission__tab', {
              'submission__tab--active': this.state.activeTab === 1,
            })}
            onClick={() => this.setState({ activeTab: 1 })}
          >
            {`My Entries (${submissions.length})`}
          </div>
          <div
            className={classnames('submission__tab', {
              'submission__tab--active': this.state.activeTab === 2,
            })}
            onClick={() => this.setState({ activeTab: 2 })}
          >
            Winners
          </div>
        </div>
        <div className="submission__rows">
          <div className="submission__header-row">
            <div className="submission__header-cell submission__header-cell--sender">Submitted By</div>
            <div className="submission__header-cell submission__header-cell--timestamp">Date</div>
            <div className="submission__header-cell submission__header-cell--result">Result</div>
          </div>
          <div className="submission__body">
            {this.renderRows()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(

)(withRouter(Submission));
