import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestEther, requestDml } from '../../ducks/faucets';

import './index.css';

class Account extends Component {
  static propTypes = {
    account: PropTypes.string.isRequired,
    ethBalance: PropTypes.string.isRequired,
    dmlBalance: PropTypes.string.isRequired,
    dmlFaucetTx: PropTypes.string.isRequired,
    etherFaucetError: PropTypes.string.isRequired,
    dmlFaucetError: PropTypes.string.isRequired,
    isRequestingEther: PropTypes.bool.isRequired,
    isRequestingDml: PropTypes.bool.isRequired,
    hasRequestedDml: PropTypes.bool.isRequired,
    requestEther: PropTypes.func.isRequired,
    requestDml: PropTypes.func.isRequired,
  };

  renderWarning() {
    const { ethBalance, dmlBalance, etherFaucetError, hasRequestedDml, dmlFaucetTx } = this.props;

    if (etherFaucetError) {
      return (
        <div className="wallet-card__error-message">
          {etherFaucetError}
        </div>
      );
    }

    if (!Number(ethBalance) || !Number(dmlBalance)) {
      return (
        <div className="wallet-card__warining-message">
          You need Ether and DML to test out the marketplace. Simply click on the request buttons below to get test tokens from our faucet.
        </div>
      );
    }

    if (hasRequestedDml && dmlFaucetTx) {
      return (
        <div className="wallet-card__warining-message">
          DML will be deposited in your account in a few minutes.
          <a
            href={`https://ropsten.etherscan.io/tx/${dmlFaucetTx}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transaction
          </a>
        </div>
      );
    }

    return (
      <div className="wallet-card__success-message">
        You are ready to try out our marketplace!
      </div>
    );
  }

  render() {
    const {
      account,
      ethBalance,
      dmlBalance,
      requestEther,
      requestDml,
      isRequestingEther,
      isRequestingDml,
      hasRequestedDml,
      etherFaucetError,
      dmlFaucetError,
    } = this.props;

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
            { this.renderWarning() }
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
                  <button
                    className="wallet-card__button"
                    onClick={requestEther}
                    disabled={Number(ethBalance) || isRequestingEther || Boolean(etherFaucetError)}
                  >
                    Request
                  </button>
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
                  <button
                    className="wallet-card__button"
                    onClick={requestDml}
                    disabled={!Number(ethBalance) || isRequestingDml || Boolean(dmlFaucetError) || hasRequestedDml}
                  >
                    Request
                  </button>
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
    ethBalance: state.metamask.ethBalance.toFixed(5),
    dmlBalance: state.metamask.dmlBalance.toFixed(0),
    etherFaucetError: state.faucets.etherFaucetError,
    isRequestingEther: state.faucets.isRequestingEther,
    isRequestingDml: state.faucets.isRequestingDml,
    dmlFaucetError: state.faucets.dmlFaucetError,
    hasRequestedDml: state.faucets.hasRequestedDml,
    dmlFaucetTx: state.faucets.dmlFaucetTx,
  }),
  dispatch => ({
    requestEther: () => dispatch(requestEther()),
    requestDml: () => dispatch(requestDml()),
  }),
)(Account);
