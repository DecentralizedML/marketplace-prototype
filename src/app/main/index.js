import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as metamaskActions from '../../ducks/metamask';
import logo from '../../logo.svg';
import './index.css';

class App extends Component {
  static propTypes = {
    startPolling: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.startPolling();
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <div className="app-header__items">
            <a className="app-header__item" href="#">Marketplace</a>
            <a className="app-header__item" href="#">Account</a>
          </div>
        </header>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    startPolling: () => dispatch(metamaskActions.startPolling()),
  })
)(App);
