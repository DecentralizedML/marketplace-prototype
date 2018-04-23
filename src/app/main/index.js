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
    signup: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
    isLocked: PropTypes.bool.isRequired,
    network: PropTypes.string,
    account: PropTypes.string.isRequired,
    hasSignedUp: PropTypes.bool.isRequired,
  };

  state = {
    hasClickedInstallMetamask: false,
    firstName: '',
    lastName: '',
    emailAddress: '',
    signupError: '',
  };

  componentWillMount() {
    this.props.startPolling();
    this.props.getUser();
  }

  signup = e => {
    e.preventDefault();

    const { firstName, lastName, emailAddress } = this.state;
    let error = '';

    if (!emailAddress) {
      error = 'Email address is empty';
    }

    if (!lastName) {
      error = 'Last name is empty';
    }

    if (!firstName) {
      error = 'First name is empty';
    }

    this.setState({ signupError: error });

    if (!error) {
      this.props.signup({ firstName, lastName, emailAddress })
        .then(d => console.log(d))
        .catch(d => console.log(d));
    }
  }

  renderContent() {
    const { hasWeb3, isLocked, network, jwt, hasSignedUp, isFetchingUser } = this.props;
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

    if (!hasSignedUp) {
      return isFetchingUser ? null : (
        <form className="app-content__signup" onSubmit={this.signup}>
          <div className="app-content__signup__header">Finish Sign Up</div>
          <div className="app-content__signup__content">
            <div className="app-content__signup__row">
              <div className="app-content__signup__label">First Name</div>
              <input
                type="text" className="app-content__signup__input"
                onChange={e => this.setState({ firstName: e.target.value })}
                value={this.state.firstName}
              />
            </div>
            <div className="app-content__signup__row">
              <div className="app-content__signup__label">Last Name</div>
              <input
                type="text" className="app-content__signup__input"
                onChange={e => this.setState({ lastName: e.target.value })}
                value={this.state.lastName}
              />
            </div>
            <div className="app-content__signup__row">
              <div className="app-content__signup__label">Email Address</div>
              <input
                type="email" className="app-content__signup__input"
                onChange={e => this.setState({ emailAddress: e.target.value })}
                value={this.state.emailAddress}
              />
            </div>
          </div>
          <div className="app-content__signup__footer">
            <div className="app-content__signup__error">
              { this.state.signupError }
            </div>
            <button
              type="submit"
              className="app-content__signup__signup-btn"
            >
              Sign Up
            </button>
          </div>
        </form>
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
    hasSignedUp: user.hasSignedUp,
    isFetchingUser: user.isFetchingUser,
  }),
  dispatch => ({
    startPolling: () => dispatch(metamaskActions.startPolling()),
    logout: () => dispatch(userActions.logout()),
    login: () => dispatch(userActions.login()),
    signup: user => dispatch(userActions.signup(user)),
    getUser: () => dispatch(userActions.getUser()),
  })
)(App);
