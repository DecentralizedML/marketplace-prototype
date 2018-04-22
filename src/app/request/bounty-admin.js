import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { BigNumber } from 'bignumber.js';
import { BOUNTY_ABI, TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, BOUNTY_STATUS } from '../../utils/constants';
import * as actions from '../../ducks/bounties';
import UpdateBountyDetailModal from './update-bounty-detail-modal';
import UpdateWinnersModal from './update-winners-modal';


const MODAL_TYPES = {
  UPDATE_BOUNTY_DETAIL: 'UPDATE_BOUNTY_DETAIL',
  UPDATE_WINNER: 'UPDATE_WINNER',
};

class BountyAdmin extends Component {
  static propTypes = {
    bountyData: PropTypes.object,
    match: PropTypes.object.isRequired,
    getBounty: PropTypes.func.isRequired,
    isLocked: PropTypes.bool.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    jwt: PropTypes.string.isRequired,
  };

  state = {
    isShowingModal: false,
    modalType: null,
    isFunded: false,
    tokenTransferTx: '',
    startEnrollmentTx: '',
  }

  componentWillMount() {
    this.poll();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  poll = () => {
    const { isLocked, hasWeb3, match: { params: { address } } } = this.props;

    if (isLocked || !hasWeb3) {
      this.timeout = setTimeout(this.poll, 1000);
      return;
    }

    const contract = window.web3.eth.contract(BOUNTY_ABI).at(address);

    contract.isFunded((err, data) => {
      if (err) {
        this.timeout = setTimeout(this.poll, 15000);
        return;
      }

      this.setState({ isFunded: data });
      this.timeout = setTimeout(this.poll, 15000);
    });

    this.props.getBounty();
  }

  fundContract = () => {
    const { isLocked, hasWeb3, bountyData, match: { params: { address } } } = this.props;
    const { isFunded, tokenTransferTx } = this.state;
    const { prizes = [] } = bountyData || {};

    if (isLocked || !hasWeb3 || isFunded || tokenTransferTx) {
      return;
    }

    const token = window.web3.eth.contract(TOKEN_CONTRACT_ABI).at(TOKEN_CONTRACT_ADDRESS);

    const total = prizes.reduce((sum, prize) => sum.plus(prize), new BigNumber(0));

    token.transfer(address, total.toFixed(0), (err, data) => {
      if (err) {
        return null;
      }

      this.setState({ tokenTransferTx: data });
    });
  }

  startEnrollment = () => {
    const { isLocked, hasWeb3, bountyData,  match: { params: { address } } } = this.props;
    const { isFunded, startEnrollmentTx } = this.state;
    const { description } = bountyData || {};

    if (isLocked || !hasWeb3 || !isFunded || startEnrollmentTx || !description) {
      return;
    }

    const bounty = window.web3.eth.contract(BOUNTY_ABI).at(address);

    bounty.startEnrollment((err, data) => {
      if (err) {
        return null;
      }

      this.setState({ startEnrollmentTx: data });
    });
  }

  stopEnrollment = () => {
    const { isLocked, hasWeb3,  match: { params: { address } } } = this.props;
    const { isFunded, stopEnrollmentTx } = this.state;

    if (isLocked || !hasWeb3 || !isFunded || stopEnrollmentTx) {
      return;
    }

    const bounty = window.web3.eth.contract(BOUNTY_ABI).at(address);

    bounty.stopEnrollment((err, data) => {
      if (err) {
        return null;
      }

      this.setState({ stopEnrollmentTx: data });
    });
  }

  startBounty = () => {
    const { isLocked, hasWeb3,  match: { params: { address } } } = this.props;
    const { isFunded, startBountyTx } = this.state;

    if (isLocked || !hasWeb3 || !isFunded || startBountyTx) {
      return;
    }

    const bounty = window.web3.eth.contract(BOUNTY_ABI).at(address);

    bounty.startBounty((err, data) => {
      if (err) {
        return null;
      }

      this.setState({ startBountyTx: data });
    });
  }

  stopBounty = () => {
    const { isLocked, hasWeb3,  match: { params: { address } } } = this.props;
    const { isFunded, stopEnrollmentTx } = this.state;

    if (isLocked || !hasWeb3 || !isFunded || stopEnrollmentTx) {
      return;
    }

    const bounty = window.web3.eth.contract(BOUNTY_ABI).at(address);

    bounty.stopBounty((err, data) => {
      if (err) {
        return null;
      }

      this.setState({ stopBountyTx: data });
    });
  }

  payWinners = () => {
    const { isLocked, hasWeb3,  match: { params: { address } } } = this.props;
    const { isFunded, payWinnersTx } = this.state;

    if (isLocked || !hasWeb3 || !isFunded || payWinnersTx) {
      return;
    }

    const bounty = window.web3.eth.contract(BOUNTY_ABI).at(address);

    bounty.payoutWinners((err, data) => {
      if (err) {
        return null;
      }

      this.setState({ payWinnersTx: data });
    });
  }

  showModal = type => {
    this.setState({
      isShowingModal: true,
      modalType: type,
    });
  }

  hideModal = () => {
    this.setState({
      isShowingModal: false,
      modalType: null,
    });
  }

  getStatus = () => {
    const { bountyData } = this.props;
    const { status } = bountyData || {};
    const currentStatus = status && status.toNumber
      ? status.toNumber()
      : 0;

    return currentStatus;
  } 

  renderModal() {
    const { isShowingModal, modalType } = this.state;
    const { match } = this.props;

    if (!isShowingModal) {
      return null;
    }

    switch(modalType) {
      case MODAL_TYPES.UPDATE_BOUNTY_DETAIL:
        return <UpdateBountyDetailModal onClose={this.hideModal} address={match.params.address} />;
      case MODAL_TYPES.UPDATE_WINNER:
        return (
          <UpdateWinnersModal
            onClose={this.hideModal}
            address={match.params.address}
            onTxSubmit={tx => this.setState({ updateWinnerTx: tx })}
          />
        );
      default:
        return null;
    }
  }

  renderButton({ text, backgroundColor, onClick, requiredStatus, disabled, shouldHide }) {
    const currentStatus = this.getStatus();

    if (typeof requiredStatus !== 'undefined' && currentStatus !== requiredStatus) {
      return null;
    }

    if (shouldHide) {
      return null;
    }

    return (
      <button
        className={`bounty-page__admin__action bounty-page__admin__action--${backgroundColor}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    );
  }

  render() {
    const { bountyData, jwt } = this.props;
    const data = bountyData || {
      prizes: [],
      participants: [],
      winners: [],
    };

    return (
      <div className="bounty-page__admin">
        <div className="bounty-page__admin__status-wrapper">
          <div className="bounty-page__admin__status-title">Status</div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': data.description,
          })}>
            Fill out bounty details
          </div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': this.state.isFunded || this.getStatus() === BOUNTY_STATUS.Completed,
          })}>
            Fund the bounty with DML
          </div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': this.getStatus() >= BOUNTY_STATUS.EnrollmentStart,
          })}>
            Start Enrollment
          </div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': this.getStatus() >= BOUNTY_STATUS.EnrollmentEnd,
          })}>
            End Enrollment
          </div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': this.getStatus() >= BOUNTY_STATUS.BountyStart,
          })}>
            Begin Bounty
          </div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': this.getStatus() >= BOUNTY_STATUS.BountyEnd,
          })}>
            End Bounty
          </div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': data.winners.length === data.prizes.length,
          })}>
            Select Winners
          </div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': this.getStatus() === BOUNTY_STATUS.Completed,
          })}>
            Pay Winners
          </div>
        </div>
        <div className="bounty-page__admin__actions">
          {/*this.renderButton({ text: 'Update Bounty Contract' })*/}
          {this.renderButton({
            text: 'Update Bounty Details',
            shouldHide: this.getStatus() > BOUNTY_STATUS.Initialized,
            disabled: this.getStatus() > BOUNTY_STATUS.Initialized || !jwt,
            onClick: () => this.showModal(MODAL_TYPES.UPDATE_BOUNTY_DETAIL),
          })}
          {this.renderButton({
            text: 'Fund the Bounty',
            backgroundColor: 'yellow',
            shouldHide: this.state.isFunded || this.getStatus() === BOUNTY_STATUS.Completed,
            onClick: this.fundContract,
            disabled: this.state.isFunded || this.state.tokenTransferTx || !jwt,
          })}
          {this.renderButton({
            text: 'Start Enrollment',
            backgroundColor: 'green',
            shouldHide: !this.state.isFunded || !data.description,
            requiredStatus: BOUNTY_STATUS.Initialized,
            onClick: this.startEnrollment,
            disabled: this.state.startEnrollmentTx || !jwt,
          })}
          {this.renderButton({
            text: 'Stop Enrollment',
            backgroundColor: 'red',
            requiredStatus: BOUNTY_STATUS.EnrollmentStart,
            onClick: this.stopEnrollment,
            disabled: this.state.stopEnrollmentTx || !jwt,
          })}
          {this.renderButton({
            text: 'Start Accepting Submission',
            backgroundColor: 'green',
            requiredStatus: BOUNTY_STATUS.EnrollmentEnd,
            onClick: this.startBounty,
            disabled: this.state.startBountyTx || !jwt,
          })}
          {this.renderButton({
            text: 'Stop Accepting Submission',
            backgroundColor: 'red',
            requiredStatus: BOUNTY_STATUS.BountyStart,
            onClick: this.stopBounty,
            disabled: this.state.stopBountyTx || !jwt,
          })}
          {this.renderButton({
            text: 'Update Winners',
            backgroundColor: 'yellow',
            requiredStatus: BOUNTY_STATUS.BountyEnd,
            shouldHide: data.winners.length === data.prizes.length,
            onClick: () => this.showModal(MODAL_TYPES.UPDATE_WINNER),
            disabled: this.state.updateWinnerTx || !jwt,
          })}
          {this.renderButton({
            text: 'Payout Bounty',
            backgroundColor: 'green',
            requiredStatus: BOUNTY_STATUS.EvaluationEnd,
            shouldHide: !data.winners.length,
            onClick: this.payWinners,
            disabled: this.state.payWinnersTx || !jwt,
          })}
        </div>
        { this.renderModal() }
      </div>
    );
  }
}

export default connect(
  (state, { match }) => ({
    bountyData: state.bounties.allBountiesMap[match.params.address],
    isLocked: state.metamask.isLocked,
    hasWeb3: state.metamask.hasWeb3,
    jwt: state.user.jwt,
  }),
  (dispatch, { match: { params: { address } } }) => ({
    getBounty: () => dispatch(actions.getBounty(address)),
  }),
)(withRouter(BountyAdmin));
