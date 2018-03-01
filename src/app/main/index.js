import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import classnames from 'classnames';
import Account from '../account';
import Marketplace from '../marketplace';
import Upload from '../upload';
import Request from '../request';
import * as metamaskActions from '../../ducks/metamask';
import logo from '../../logo.svg';
import loginImg from './metamask-login.png';
import networkImg from './metamask-network.png';
import './index.css';

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
            <h1>You do not have MetaMask installed.</h1>
            <p>Simply follow Metamask's instructions to finish the installation.</p>
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
            <h1>You do not have MetaMask installed.</h1>
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
          <h1>Your MetaMask is locked.</h1>
          <p>Simply unlock it by clicking on the MetaMask extension and type your password.</p>
          <img src={loginImg} className="metamask-login" alt="metamask-login" />
        </div>
      );
    }

    if (network !== '3') {
      return (
        <div className="app-content__message">
          <h1>Oops, you’re on the wrong network.</h1>
          <p>Simply open MetaMask and switch over to the Ropsten Network.</p>
          <img src={networkImg} className="metamask-network" alt="metamask-network" />
        </div>
      );
    }

    return (
      <div className="app-content">
        <Switch>
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/account" component={Account} />
          <Route path="/upload" component={Upload} />
          <Route path="/request" component={Request} />
          <Route component={Marketplace}/>
        </Switch>
      </div>
    );
  }

  render() {
    const pathname = window.location.pathname;

    return (
      <Router>
        <div className="app">
          <header className="app-header">
            <img src={logo} className="app-logo" alt="logo" />
            <div className="app-header__items">
              <Link
                className={classnames('app-header__item', {
                  'app-header__item--active': (/marketplace/gi).test(pathname),
                })}
                to="marketplace"
              >
                Marketplace
              </Link>
              <Link
                className={classnames('app-header__item', {
                  'app-header__item--active': (/account/gi).test(pathname),
                })}
                to="account"
              >
                Account
              </Link>
              <Link
                className={classnames('app-header__item', {
                  'app-header__item--active': (/upload/gi).test(pathname),
                })}
                to="upload"
              >
                Upload
              </Link>
              <Link
                className={classnames('app-header__item', {
                  'app-header__item--active': (/request/gi).test(pathname),
                })}
                to="request"
              >
                Request
              </Link>
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
