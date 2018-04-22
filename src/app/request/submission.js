import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as actions from '../../ducks/bounties';

import './submission.css';

class Submission extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    getSubmission: PropTypes.func.isRequired,
    account: PropTypes.string.isRequired,
  };

  state = {
    activeTab: 0,
  };

  componentWillMount() {
    const { match: { params: { address } } } = this.props;
    this.props.getSubmission(address);
  }

  renderTime(timestamp) {
    return moment(timestamp).format('YYYY-MM-DD h:mm:ssa');
  }

  renderRows(list) {
    const { account } = this.props;

    if (!list.length) {
      return (
        <div className="submission__empty-results">
          No Results
        </div>
      );
    }
    return list.map(({ submittedBy = '', link, timestamp }) => (
      <div className="submission__row">
        <div className="submission__cell submission__cell--sender">
          {`${submittedBy.slice(0, 4)}...${submittedBy.slice(-4)}`}
        </div>
        <div className="submission__cell submission__cell--timestamp">
          {this.renderTime(timestamp)}
        </div>
        <div className="submission__cell submission__cell--result">
          <button
            disabled={submittedBy !== account}
          >
            Download Result
          </button>
        </div>
      </div>
    ));
  }

  render() {
    const { activeTab } = this.state;
    const { submissions, account } = this.props;
    const myList = submissions.filter(({ submittedBy }) => submittedBy === account);

    const list = activeTab === 1
      ? myList
      : submissions;

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
            {`My Entries (${myList.length})`}
          </div>
        </div>
        <div className="submission__rows">
          <div className="submission__header-row">
            <div className="submission__header-cell submission__header-cell--sender">Submitted By</div>
            <div className="submission__header-cell submission__header-cell--timestamp">Date</div>
            <div className="submission__header-cell submission__header-cell--result">Result</div>
          </div>
          <div className="submission__body">
            {this.renderRows(list)}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state, { match: { params: { address } } }) => ({
    submissions: state.bounties.submissions[address] || [],
    account: state.metamask.accounts[0],
  }),
  dispatch => ({
    getSubmission: address => dispatch(actions.getSubmission(address)),
  }),
)(withRouter(Submission));
