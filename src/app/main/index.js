import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import * as metamaskActions from '../../ducks/metamask';
import logo from '../../logo.svg';
import './index.css';

const Marketplace = () => <h1>Marketplace</h1>;
const Account = () => <h1>Account</h1>;

class App extends Component {
  static propTypes = {
    startPolling: PropTypes.func.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    isLocked: PropTypes.bool.isRequired,
    network: PropTypes.string,
  };

  state = {
    hasClickedInstallMetamask: false,
  };

  componentWillMount() {
    this.props.startPolling();
  }

  renderContent() {
    const { hasWeb3, isLocked, network } = this.props;
    const { hasClickedInstallMetamask } = this.state;

    if (!hasWeb3) {
      if (hasClickedInstallMetamask) {

      }

      return hasClickedInstallMetamask
        ? (
          <div className="app-content__message">
            <p>Follow Metamask's instructions to finish the installation.</p>
            <button
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              I have installed Metamask
            </button>
          </div>
        )
        : (
          <div className="app-content__message">
            <p>You will need to install Metamask in order to access the marketplace.</p>
            <a
              href="https://metamask.io/"
              className="btn-metamask"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.setState({ hasClickedInstallMetamask: true })}
            >
              Install Metamask
            </a>
          </div>
        );
    }

    if (isLocked) {
      return (
        <div className="app-content__message">
          <p>First make sure you created an account.</p>
          <p>If you did, unlock it by simply clicking on the MetaMask extension and type your password.</p>
        </div>
      );
    }

    if (network !== '3') {
      return (
        <div>Please switch to Ropsten</div>
      );
    }

    return (
      <div className="app-content">
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/account" component={Account} />
      </div>
    );
  }

  render() {
    return (
      <Router>
        <div className="app">
          <header className="app-header">
            <img src={logo} className="app-logo" alt="logo" />
            <div className="app-header__items">
              <Link className="app-header__item" to="marketplace">Marketplace</Link>
              <Link className="app-header__item" to="account">Account</Link>
            </div>
          </header>
          { this.renderContent() }
        </div>
      </Router>
    );
  }
}

export default connect(
  ({ metamask: { hasWeb3, isLocked, network }}) => ({
    hasWeb3, isLocked, network,
  }),
  dispatch => ({
    startPolling: () => dispatch(metamaskActions.startPolling()),
  })
)(App);
