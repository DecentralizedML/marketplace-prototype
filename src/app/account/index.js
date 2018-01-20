import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './index.css';

class Account extends Component {
  static propTypes = {
    account: PropTypes.string.isRequired,
    ethBalance: PropTypes.string.isRequired,
    dmlBalance: PropTypes.string.isRequired,
  };

  render() {
    const { account, ethBalance, dmlBalance } = this.props;

    return (
      <div className="account">
        <div className="wallet-card">
          <div className="wallet-card__header">
            <div className="wallet-card__title">Your Wallet Balance</div>
            <a
              className="wallet-card__wallet-selector"
              href={`https://ropsten.etherscan.io/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`Address: ${account.slice(0, 6)}...${account.slice(-6)}`}
            </a>
          </div>
          <div className="wallet-card__content">
            <div className="wallet-card__balances">
              <div className="wallet-card__balance-row">
                <div className="wallet-card__balance">
                  <div className="wallet-card__balance-header-text">Ethereum Balance:</div>
                  <div className="wallet-card__balance-wrapper">
                    <span className="wallet-card__balance-text">{ethBalance}</span>
                    <span className="wallet-card__balance-unit">ETH</span>
                  </div>
                </div>
                <div className="wallet-card__actions">
                  <button className="wallet-card__button">Request</button>
                </div>
              </div>
              <div className="wallet-card__balance-row">
                <div className="wallet-card__balance">
                  <div className="wallet-card__balance-header-text">DML Balance:</div>
                  <div className="wallet-card__balance-wrapper">
                    <span className="wallet-card__balance-text">{dmlBalance}</span>
                    <span className="wallet-card__balance-unit wallet-card__balance-unit--dml">DML</span>
                  </div>
                </div>
                <div className="wallet-card__actions">
                  <button className="wallet-card__button">Request</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    account: state.metamask.accounts[0] || '',
    ethBalance: state.metamask.ethBalance.toFixed(3),
    dmlBalance: state.metamask.dmlBalance.toFixed(0),
  }),
  null
)(Account);
