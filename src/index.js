import "babel-polyfill";
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducer from './ducks';
import Main from './app/main';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const middlewares = process.env.NODE_ENV === 'development'
  ? applyMiddleware(thunk, logger)
  : applyMiddleware(thunk);

// const store = createStore(reducer, composeWithDevTools(middlewares));
const store = createStore(reducer, middlewares);

ReactDOM.render(
  <Provider store={store}>
      <Main />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
