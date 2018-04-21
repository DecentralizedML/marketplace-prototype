import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { BigNumber } from 'bignumber.js';
import { BOUNTY_ABI, TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI } from '../../utils/constants';
// import * as actions from '../../ducks/bounties';
import UpdateBountyDetailModal from './update-bounty-detail-modal';


const MODAL_TYPES = {
  UPDATE_BOUNTY_DETAIL: 'UPDATE_BOUNTY_DETAIL',
};

class BountyAdmin extends Component {
  static propTypes = {
    bountyData: PropTypes.object,
    match: PropTypes.object.isRequired,
  };

  state = {
    isShowingModal: false,
    modalType: null,
    isFunded: false,
    tokenTransferTx: '',
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
      this.timeout = setTimeout(this.pool, 1000);
      return;
    }

    const contract = window.web3.eth.contract(BOUNTY_ABI).at(address);
    contract.isFunded((err, data) => {
      if (err) {
        this.timeout = setTimeout(this.pool, 15000);
        return;
      }

      this.setState({ isFunded: data });
      this.timeout = setTimeout(this.pool, 15000);
    });
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

  renderModal() {
    const { isShowingModal, modalType } = this.state;
    const { match } = this.props;

    if (!isShowingModal) {
      return null;
    }

    switch(modalType) {
      case MODAL_TYPES.UPDATE_BOUNTY_DETAIL:
        return <UpdateBountyDetailModal onClose={this.hideModal} address={match.params.address} />;
      default:
        return null;
    }
  }

  renderButton({ text, backgroundColor, onClick, requiredStatus, disabled, shouldHide }) {
    const { bountyData } = this.props;
    const { status } = bountyData || {};
    const currentStatus = status && status.toNumber
      ? status.toNumber()
      : 0;

    if (requiredStatus && currentStatus !== requiredStatus) {
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
    const { bountyData } = this.props;
    const data = bountyData || {
      prizes: [],
      participants: [],
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
            'bounty-page__admin__checklist-item--checked': this.state.isFunded,
          })}>
            Fund the bounty with DML
          </div>
        </div>
        <div className="bounty-page__admin__actions">
          {/*this.renderButton({ text: 'Update Bounty Contract' })*/}
          {this.renderButton({
            text: 'Update Bounty Details',
            onClick: () => this.showModal(MODAL_TYPES.UPDATE_BOUNTY_DETAIL),
          })}
          {this.renderButton({
            text: 'Fund the Bounty',
            backgroundColor: 'yellow',
            onClick: this.fundContract,
            disabled: this.state.isFunded || this.state.tokenTransferTx,
          })}
          {this.renderButton({
            text: 'Start Enrollment',
            backgroundColor: 'green',
            shouldHide: !this.state.isFunded || !data.description,
          })}
          {this.renderButton({
            text: 'Stop Enrollment',
            backgroundColor: 'red',
            requiredStatus: 4,
          })}
          {this.renderButton({
            text: 'Start Submission',
            backgroundColor: 'green',
            requiredStatus: 5,
          })}
          {this.renderButton({
            text: 'End Submission',
            backgroundColor: 'red',
            requiredStatus: 6,
          })}
          {this.renderButton({
            text: 'Update Winners',
            backgroundColor: 'yellow',
            requiredStatus: 7,
          })}
          {this.renderButton({
            text: 'Payout Bounty',
            backgroundColor: 'green',
            requiredStatus: 8,
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
  })
)(withRouter(BountyAdmin));
