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

  componentWillMount() {
    this.props.startPolling();
  }

  renderContent() {
    const { hasWeb3, isLocked, network } = this.props;

    if (!hasWeb3) {
      return (
        <div>Cannot detect Metamask. Please download</div>
      );
    }

    if (isLocked) {
      return (
        <div>Please unlock metamask</div>
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
