import React, { Component } from 'react';
import logo from '../../logo.svg';
import './index.css';

class App extends Component {
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

export default App;
