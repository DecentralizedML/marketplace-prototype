import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/bounties';
import BountyRow from './bounty-row';
import CreateBountyModal from './create-bounty-modal';

import './index.css';

const TABS = ['All', 'Completed'];

class Request extends Component {
  static propTypes = {
    getAllBounties: PropTypes.func.isRequired,
    allBounties: PropTypes.array.isRequired,
    isLoadingAllBounties: PropTypes.bool.isRequired,
  };

  state = {
    activeTab: 0,
    isShowingCreateModal: false,
  };

  componentWillMount() {
    this.props.getAllBounties();
  }

  closeModal = e => {
    e.stopPropagation();
    this.setState({ isShowingCreateModal: false });
  }

  openModal = () => {
    this.setState({ isShowingCreateModal: true });
  }

  renderRows() {
    return this.props.allBounties.map(bounty => (
      <BountyRow
        key={bounty}
        address={bounty}
      />
    ));
  }

  renderContent() {
    const { isLoadingAllBounties, allBounties } = this.props;

    if (isLoadingAllBounties) {
      return (
        <div className="bounty__content bounty__content--loading" />
      );
    }

    if (!allBounties.length) {
      return <div className="bounty__content bounty__content--empty">No Bounties</div>;
    }

    return (
      <div className="bounty__content">
        {this.renderRows()}
      </div>
    );
  }

  renderModal() {
    return !this.state.isShowingCreateModal
      ? null
      : <CreateBountyModal onClose={this.closeModal} />;
  }

  render() {
    return (
      <div className="bounty">
        <div className="bounty__header">
          <div className="bounty__header__tabs">
            {TABS.map((name, i) => (
              <div
                key={name}
                className={classnames('bounty__header__tab', {
                  'bounty__header__tab--active': this.state.activeTab === i,
                })}
                onClick={() => this.setState({ activeTab: i })}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="bounty__header__actions">
            <button
              className="bounty__create-btn"
              onClick={this.openModal}
            >
              Create New Bounty
            </button>
          </div>
        </div>
        { this.renderContent() }
        { this.renderModal() }
      </div>
    );
  }
}

export default connect(
  state => ({
    allBounties: state.bounties.allBounties,
    isLoadingAllBounties: state.bounties.isLoadingAllBounties,
  }),
  dispatch => ({
    getAllBounties: () => dispatch(actions.getAllBounties()),
  })
)(Request);