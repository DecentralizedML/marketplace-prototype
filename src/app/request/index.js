import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/bounties';
import BountyRow from './bounty-row';

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
  };

  componentWillMount() {
    this.props.getAllBounties();
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
    if (this.props.isLoadingAllBounties) {
      return (
        <div className="bounty__content bounty__content--loading" />
      );
    }

    return (
      <div className="bounty__content">
        {this.renderRows()}
      </div>
    );
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
            <button className="bounty__create-btn">Create New Bounty</button>
          </div>
        </div>
        { this.renderContent() }
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