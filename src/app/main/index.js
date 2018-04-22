import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link, BrowserRouter as Router, } from 'react-router-dom';
import classnames from 'classnames';
import Account from '../account';
import Marketplace from '../marketplace';
// import Upload from '../upload';
import Request from '../request';
import * as metamaskActions from '../../ducks/metamask';
import * as userActions from '../../ducks/user';
import logo from '../../logo.svg';
import loginImg from './metamask-login.png';
import networkImg from './metamask-network.png';
import signImg from './metamask-sign-message.png';
import './index.css';

class App extends Component {
  static propTypes = {
    startPolling: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    isLocked: PropTypes.bool.isRequired,
    network: PropTypes.string,
    account: PropTypes.string.isRequired,
  };

  state = {
    hasClickedInstallMetamask: false,
  };

  componentWillMount() {
    this.props.startPolling();
  }

  renderContent() {
    const { hasWeb3, isLocked, network, jwt } = this.props;
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

    if (network !== '4') {
    // if (process.env.NODE_ENV !== 'development' && network !== '4') {
      return (
        <div className="app-content__message">
          <h1>Oops, you’re on the wrong network.</h1>
          <p>Simply open MetaMask and switch over to the Rinkeby Network.</p>
          <img src={networkImg} className="metamask-network" alt="metamask-network" />
        </div>
      );
    }

    if (!jwt) {
      return (
        <div className="app-content__message">
          <h1>You are currently logged out.</h1>
          <p>Please log in to your account by clicking the button below.</p>
          <p>You will then receive a prompt from MetaMask to sign a secret message.</p>
          <button
            className="app-header__login"
            onClick={this.props.login}
          >
            Login
          </button>
          <img src={signImg} className="metamask-network" alt="metamask-network" />
        </div>
      );
    }

    return (
      <div className="app-content">
        <Switch>
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/account" component={Account} />
          <Route path="/bounties" component={Request} />
          <Route component={Marketplace}/>
        </Switch>
      </div>
    );
  }
          // <Route path="/upload" component={Upload} />
    // <Link
    //   className={classnames('app-header__item', {
    //     'app-header__item--active': (/upload/gi).test(pathname),
    //   })}
    //   to="upload"
    // >
    //   Upload
    // </Link>

  renderLoginButton() {
    const { jwt, logout } = this.props;

    if (jwt) {
      return (
        <button
          className="app-header__logout"
          onClick={() => logout()}
        >
          Logout
        </button>
      );
    }

    // return (
    //   <button
    //     className="app-header__login"
    //     onClick={login}
    //   >
    //     Login/Signup
    //   </button>
    // );
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
                to="/marketplace"
              >
                Marketplace
              </Link>
              <Link
                className={classnames('app-header__item', {
                  'app-header__item--active': (/account/gi).test(pathname),
                })}
                to="/account"
              >
                Account
              </Link>
              <Link
                className={classnames('app-header__item', {
                  'app-header__item--active': (/bounties/gi).test(pathname),
                })}
                to="/bounties"
              >
                Bounties
              </Link>
            </div>
            {this.renderLoginButton()}
          </header>
          { this.renderContent() }
        </div>
      </Router>
    );
  }
}

export default connect(
  ({ metamask: { hasWeb3, isLocked, network, accounts }, user }) => ({
    hasWeb3,
    isLocked,
    network,
    account: accounts[0] || '',
    jwt: user.jwt,
  }),
  dispatch => ({
    startPolling: () => dispatch(metamaskActions.startPolling()),
    logout: () => dispatch(userActions.logout()),
    login: () => dispatch(userActions.login()),
  })
)(App);
