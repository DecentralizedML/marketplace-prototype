import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Approval from './approval';

import './index.css';

class Account extends Component {
  static propTypes = {
    account: PropTypes.string.isRequired,
    ethBalance: PropTypes.string.isRequired,
    dmlBalance: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
  };

  renderWarning() {
    // const { ethBalance, dmlBalance, etherFaucetError, hasRequestedDml, dmlFaucetTx } = this.props;

    // if (Number(ethBalance) && Number(dmlBalance)) {
    //   return (
    //     <div className="wallet-card__success-message">
    //       You are ready to try out our marketplace!
    //     </div>
    //   );
    // }

    // if (etherFaucetError) {
    //   return (
    //     <div className="wallet-card__error-message">
    //       {etherFaucetError}
    //     </div>
    //   );
    // }

    // if (!Number(ethBalance) || !Number(dmlBalance)) {
    //   return (
    //     <div className="wallet-card__warining-message">
    //       You need Ether and DML to test out the marketplace. Simply click on the request buttons below to get test tokens from our faucet.
    //     </div>
    //   );
    // }


    // if (hasRequestedDml && dmlFaucetTx) {
    //   return (
    //     <div className="wallet-card__warining-message">
    //       DML will be deposited in your account in a few minutes.
    //       <a
    //         href={`https://ropsten.etherscan.io/tx/${dmlFaucetTx}`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         View Transaction
    //       </a>
    //     </div>
    //   );
    // }

    return null;
  }

  renderEtherBalance() {
    // const { ethBalance } = this.props;

    return null;
    // return (
    //   <div className="wallet-card__balance-row">
    //     <div className="wallet-card__balance">
    //       <div className="wallet-card__balance-header-text">Ethereum Balance:</div>
    //       <div className="wallet-card__balance-wrapper">
    //         <span className="wallet-card__balance-text">{ethBalance}</span>
    //         <span className="wallet-card__balance-unit">ETH</span>
    //       </div>
    //     </div>
    //   </div>
    // )
  }

  renderDmlBalance() {
    const { dmlBalance } = this.props;

    return (
      <div className="wallet-card__balance-row">
        <div className="wallet-card__balance">
          <div className="wallet-card__balance-header-text">DML Balance:</div>
          <div className="wallet-card__balance-wrapper">
            <span className="wallet-card__balance-text">{dmlBalance}</span>
            <span className="wallet-card__balance-unit wallet-card__balance-unit--dml">DML</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { account, firstName, lastName, emailAddress } = this.props;

    return (
      <div className="account">
        <div className="wallet-card">
          <div className="wallet-card__header">
            <div className="wallet-card__title">Account Info</div>
          </div>
          <div className="wallet-card__content">
            <div className="wallet-card__balances">
              <div className="wallet-card__balance-row">
                <div className="wallet-card__balance">
                  <div className="wallet-card__balance-header-text">First Name</div>
                  <div className="wallet-card__balance-wrapper">
                    <span className="wallet-card__balance-text">{firstName}</span>
                  </div>
                </div>
              </div>
              <div className="wallet-card__balance-row">
                <div className="wallet-card__balance">
                  <div className="wallet-card__balance-header-text">Last Name</div>
                  <div className="wallet-card__balance-wrapper">
                    <span className="wallet-card__balance-text">{lastName}</span>
                  </div>
                </div>
              </div>
              <div className="wallet-card__balance-row">
                <div className="wallet-card__balance">
                  <div className="wallet-card__balance-header-text">Email Address</div>
                  <div className="wallet-card__balance-wrapper">
                    <span className="wallet-card__balance-text">{emailAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="wallet-card">
          <div className="wallet-card__header">
            <div className="wallet-card__title">Balance</div>
            <a
              className="wallet-card__wallet-selector"
              href={`https://etherscan.io/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`Address: ${account.slice(0, 6)}...${account.slice(-6)}`}
            </a>
          </div>
          <div className="wallet-card__content">
            { this.renderWarning() }
            <div className="wallet-card__balances">
              { this.renderEtherBalance() }
              { this.renderDmlBalance() }
            </div>
          </div>
        </div>
        <Approval />
      </div>
    );
  }
}

export default connect(
  state => ({
    account: state.metamask.accounts[0] || '',
    ethBalance: state.metamask.ethBalance.toFixed(5),
    dmlBalance: state.metamask.dmlBalance.toFixed(0),
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    emailAddress: state.user.emailAddress,
  })
)(Account);
