import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import PropTypes from 'prop-types';
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

  renderButton({text, backgroundColor, onClick, requiredStatus}) {
    const { bountyData } = this.props;
    const { status } = bountyData || {};
    const currentStatus = status && status.toNumber
      ? status.toNumber()
      : 0;

    if (requiredStatus && currentStatus !== requiredStatus) {
      return null;
    }

    return (
      <button
        className={`bounty-page__admin__action bounty-page__admin__action--${backgroundColor}`}
        onClick={onClick}
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
            'bounty-page__admin__checklist-item--checked': false
          })}>
            Fill out bounty details
          </div>
          <div className={classnames('bounty-page__admin__checklist-item', {
            'bounty-page__admin__checklist-item--checked': false
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
          })}
          {this.renderButton({
            text: 'Start Enrollment',
            backgroundColor: 'green',
            requiredStatus: 3,
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
  })
)(withRouter(BountyAdmin));
