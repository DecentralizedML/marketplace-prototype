import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/bounties';
import BountyRow from './bounty-row';
import CreateBountyModal from './create-bounty-modal';
import Bounty from './bounty';
import { Switch, Route } from 'react-router-dom';


import './index.css';

const TABS = ['All', 'Created By Me'];

class Request extends Component {
  static propTypes = {
    getAllBounties: PropTypes.func.isRequired,
    getAllBountiesCreatedByMe: PropTypes.func.isRequired,
    allBounties: PropTypes.array.isRequired,
    createdByMe: PropTypes.array.isRequired,
    isLoadingAllBounties: PropTypes.bool.isRequired,
    isLoadingAllBountiesCreatedByMe: PropTypes.bool.isRequired,
  };

  state = {
    activeTab: 0,
    isShowingCreateModal: false,
  };

  componentWillMount() {
    this.props.getAllBounties();
    this.props.getAllBountiesCreatedByMe();
  }

  closeModal = e => {
    e.stopPropagation();
    this.setState({ isShowingCreateModal: false });
  }

  openModal = () => {
    this.setState({ isShowingCreateModal: true });
  }

  renderRows(bounties) {
    let rows = [];

    for (let i = bounties.length - 1; i >= 0; i--) {
      const bounty = bounties[i];
      rows.push(
        <BountyRow
          key={bounty}
          address={bounty}
        />
      );
    }

    return rows;
  }

  renderContent() {
    const {
      isLoadingAllBounties,
      isLoadingAllBountiesCreatedByMe,
      allBounties,
      createdByMe,
    } = this.props;

    if (this.state.activeTab === 0) {
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
          {this.renderRows(allBounties)}
        </div>
      );
    }

    if (this.state.activeTab === 1) {
      if (isLoadingAllBountiesCreatedByMe) {
        return (
          <div className="bounty__content bounty__content--loading" />
        );
      }

      if (!createdByMe.length) {
        return <div className="bounty__content bounty__content--empty">No Bounties</div>;
      }

      return (
        <div className="bounty__content">
          {this.renderRows(createdByMe)}
        </div>
      );
    }

  }

  renderModal() {
    return !this.state.isShowingCreateModal
      ? null
      : <CreateBountyModal onClose={this.closeModal} />;
  }

  renderMain = () => {
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

  render() {
    return (
      <Switch>
        <Route path="/bounties/:address" component={Bounty} />
        <Route render={this.renderMain}/>
      </Switch>
    );
  }
}

export default connect(
  state => ({
    allBounties: state.bounties.allBounties,
    createdByMe: state.bounties.createdByMe,
    isLoadingAllBounties: state.bounties.isLoadingAllBounties,
    isLoadingAllBountiesCreatedByMe: state.bounties.isLoadingAllBountiesCreatedByMe,
  }),
  dispatch => ({
    getAllBounties: () => dispatch(actions.getAllBounties()),
    getAllBountiesCreatedByMe: () => dispatch(actions.getAllBountiesCreatedByMe()),
  })
)(Request);