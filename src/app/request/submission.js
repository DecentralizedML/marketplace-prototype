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
    const { account, bountyData } = this.props;
    const { createdBy } = bountyData || {};

    if (!list.length) {
      return (
        <div className="submission__empty-results">
          No Results
        </div>
      );
    }

    return list.map(({ submittedBy = '', timestamp, link }, i) => (
      <div className="submission__row">
        <div className="submission__cell submission__cell--sender">
          {`${submittedBy.slice(0, 4)}...${submittedBy.slice(-4)}`}
        </div>
        <div className="submission__cell submission__cell--timestamp">
          {this.renderTime(timestamp)}
        </div>
        <div className="submission__cell submission__cell--result">
          <button
            disabled={(submittedBy !== account && createdBy !== account) || this.state.isDownloading}
            onClick={async () => {
              this.setState({ isDownloading: true });
              const filename = link.replace('https://www.googleapis.com/storage/v1/b/bounty-submissions/o/', '');

              const f = await fetch('https://cors-anywhere.herokuapp.com/http://104.198.104.19:8881/get_submission', {
                body: JSON.stringify({
                  filename,
                  account,
                }),
                headers: {
                  'content-type': 'application/json',
                  Authorization: this.props.jwt,
                },
                method: 'POST',
              });

              if (f.status > 200) {
                this.setState({ isDownloading: false });
                return null;
              };

              const blob = await f.blob();
              
              const a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";

              const url = window.URL.createObjectURL(blob);
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);
              this.setState({ isDownloading: false });
            }}
          >
            { this.state.isDownloading ? 'Downloading' : 'Download Result' }
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
    account: state.metamask.accounts[0],
    jwt: state.user.jwt,
  }),
  dispatch => ({
    getSubmission: address => dispatch(actions.getSubmission(address)),
  }),
)(withRouter(Submission));
