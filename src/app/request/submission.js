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
    bountyData: PropTypes.object,
    isDownloadingSubmission: PropTypes.bool.isRequired,
  };

  state = {
    activeTab: 0,
    isDownloading: false,
  };

  componentWillMount() {
    const { match: { params: { address } } } = this.props;
    this.props.getSubmission(address);
  }

  renderTime(timestamp) {
    return moment(timestamp).format('YYYY-MM-DD h:mm:ssa');
  }

  renderRows(list) {
    const { account, bountyData, isDownloadingSubmission, downloadSubmissionResult } = this.props;
    const { createdBy } = bountyData || {};

    if (!list.length) {
      return (
        <div className="submission__empty-results">
          No Results
        </div>
      );
    }

    return list.map(({ submittedBy = '', timestamp, link, _id, address }, i) => (
      <div key={link} className="submission__row">
        <div className="submission__cell submission__cell--sender">
          {`${submittedBy.slice(0, 4)}...${submittedBy.slice(-4)}`}
        </div>
        <div className="submission__cell submission__cell--timestamp">
          {this.renderTime(timestamp)}
        </div>
        <div className="submission__cell submission__cell--result">
          <button
            disabled={(submittedBy !== account && createdBy !== account) || isDownloadingSubmission}
            onClick={() => downloadSubmissionResult(link, _id, address)}
          >
            { isDownloadingSubmission ? 'Downloading' : 'Download Result' }
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
    bountyData: state.bounties.allBountiesMap[address],
    submissions: state.bounties.submissions[address] || [],
    isDownloadingSubmission: state.bounties.isDownloadingSubmission,
    account: state.metamask.accounts[0],
    jwt: state.user.jwt,
  }),
  dispatch => ({
    getSubmission: address => dispatch(actions.getSubmission(address)),
    downloadSubmissionResult: (link, _id, address) => dispatch(actions.downloadSubmissionResult(link, _id, address)),
  }),
)(withRouter(Submission));
