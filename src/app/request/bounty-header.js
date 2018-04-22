import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
// import classnames from 'classnames';
import PropTypes from 'prop-types';
import { BOUNTY_STATUS, BOUNTY_FACTORY_ADDRESS, BOUNTY_FACTORY_ABI } from '../../utils/constants';
// import * as actions from '../../ducks/bounties';

class BountyHeader extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    bountyData: PropTypes.object,
    isCreatedByMe: PropTypes.bool.isRequired,
    isLocked: PropTypes.bool.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    account: PropTypes.string,
  };

  static defaultProps = {
    bountyData: {
      prizes: [],
      participants: [],
    },
  };

  state = {
    joinTx: '',
  };

  join = () => {
    const { address, hasWeb3, isLocked, account, bountyData: { participants }, isCreatedByMe } = this.props;

    if (!hasWeb3 || isLocked || !address || participants.indexOf(account) > -1 || this.state.joinTx || isCreatedByMe) {
      return;
    }

    const factory = window.web3.eth.contract(BOUNTY_FACTORY_ABI).at(BOUNTY_FACTORY_ADDRESS);

    factory.joinBounty(address, (err, data) => {
      if (err) {
        return null;
      }

      this.setState({ joinTx: data });
    });
  }

  renderStatus(status) {
    return (
      <div className={`bounty-page__status bounty-page__status--${getStatus(status)}`}>
        {getText(status)}
      </div>
    );

    function getText(st) {
      let value;

      if (typeof st === 'number') {
        value = st;
      } else if (st && st.toNumber) {
        value = st.toNumber();
      }

      switch (value) {
        case BOUNTY_STATUS.Initialized:
          return 'Not Ready for Enrollment';
        case BOUNTY_STATUS.EnrollmentStart:
          return 'Accepting Participants';
        case BOUNTY_STATUS.EnrollmentEnd:
          return 'Enrollment Ended - Waiting for Bounty to Start';
        case BOUNTY_STATUS.BountyStart:
          return 'Accepting Submissions';
        case BOUNTY_STATUS.BountyEnd:
          return 'Evaluation in Progress';
        case BOUNTY_STATUS.EvaluationEnd:
          return 'Evaluation Completed - Pending Payouts';
        case BOUNTY_STATUS.Completed:
          return 'Bounty Completed';
        default:
          return 'Pending';
      }
    }

    function getStatus(st) {
      let value;

      if (typeof st === 'number') {
        value = st;
      } else if (st && st.toNumber) {
        value = st.toNumber();
      }

      switch (value) {
        case BOUNTY_STATUS.Initialized:
          return 'initialized';
        case BOUNTY_STATUS.EnrollmentStart:
          return 'enrollment_started';
        case BOUNTY_STATUS.EnrollmentEnd:
          return 'enrollment_end';
        case BOUNTY_STATUS.BountyStart:
          return 'bounty_start';
        case BOUNTY_STATUS.BountyEnd:
          return 'bounty_end';
        case BOUNTY_STATUS.EvaluationEnd:
          return 'eval_end';
        case BOUNTY_STATUS.Completed:
          return 'completed';
        default:
          return '';
      }
    }
  }

  getStatus = () => {
    const { bountyData: { status } } = this.props;

    if (status && status.toNumber) {
      return status.toNumber();
    }

    return 0;
  }

  render() {
    const { bountyData, isCreatedByMe, account } = this.props;
    const {
      imageUrl,
      title,
      subtitle,
      prizes,
      participants,
      status,
    } = bountyData;

    return (
      <div 
        className="bounty-page__header"
        style={{
          backgroundImage: imageUrl && `url(${imageUrl})`,
        }}
      >
        <div className="bounty-page__header-cover" style={{ opacity: imageUrl ? 1 : 0 }}/>
        <div className="bounty-page__primary-data">
          <div className="bounty-page__general-info">
            <div className="bounty-page__title">
              {title}
            </div>
            <div className="bounty-page__subtitle">
              {subtitle}
            </div>
          </div>
          <div className="bounty-page__prize-info">
            <div className="bounty-page__prize">
              {`${prizes.reduce((sum, prize) => sum + prize.toNumber()/1000000000000000000, 0).toFixed(0)} DML`}
            </div>
            <div className="bounty-page__prize-text">
              Total Prize
            </div>
          </div>
        </div>
        <div className="bounty-page__secondary-data">
          <div className="bounty-page__secondary-data__info">
            { this.renderStatus(status) }
            <div className="bounty-page__secondary-data__divider" />
            <div className="bounty-page__participants">
              {`${participants.length} participants`}
            </div>
          </div>
          <div className="bounty-page__secondary-data__actions">
            <button
              className="bounty-page__secondary-data__action"
              disabled={this.getStatus() !== 1 || isCreatedByMe || this.state.joinTx || participants.indexOf(account) > -1}
              onClick={this.join}
            >
              {
                this.state.joinTx
                  ? 'Joining...'
                  : participants.indexOf(account) > -1
                    ? 'Joined'
                    : 'Join'
              }
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state, { address }) => ({
    bountyData: state.bounties.allBountiesMap[address],
    isCreatedByMe: state.bounties.createdByMe.indexOf(address) > -1,
    isLocked: state.metamask.isLocked,
    hasWeb3: state.metamask.hasWeb3,
    account: state.metamask.accounts[0],
  }),
)(withRouter(BountyHeader));
