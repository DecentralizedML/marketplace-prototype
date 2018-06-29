import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/algorithms';
import Modal from '../components/modal';

import './upload-algo-modal.css';

class UploadAlgoModal extends Component {
  static propTypes = {
    addAlgo: PropTypes.func.isRequired,
  };

  state = {
    price: '',
    error: '',
    hasAddedAlgo: false,
  };

  createAlgo = () => {
    const { price } = this.state;

    if (!price || isNaN(Number(price))) {
      this.setState({
        error: 'Price must be a number',
      });
      return;
    }

    this.props.addAlgo(price)
      .then(() => {
        this.setState({
          error: '',
          price: '',
          hasAddedAlgo: true,
        });
      })
      .catch(e => {
        if ((/User denied transaction/gi).test(e.message)) {
          this.setState({ error: 'MetaMask - User denied transaction' });
        } else {
          this.setState({ error: e.message });
        }
      });
  }

  renderContent() {
    if (this.state.hasAddedAlgo) {
      return (
        <div className="upload-algo-modal" onClick={e => e.stopPropagation()}>
          <div className="upload-algo-modal__header">
            Upload New Algo
          </div>
          <div className="upload-algo-modal__content">
          <div className="upload-algo-modal__success">
            Your algo contract is deployed! It will take about 1 minute before it shows up on your account.
          </div>
          </div>
          <div className="upload-algo-modal__footer">
            <button
              className="upload-algo-modal__create-btn"
              onClick={this.props.onClose}
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="upload-algo-modal" onClick={e => e.stopPropagation()}>
        <div className="upload-algo-modal__header">
          Upload New Algo
        </div>
        <div className="upload-algo-modal__content">
          <div className="upload-algo-modal__instruction">
            This will deploy an Algorithm contract to the Ethereum network. After the contract deployed, you will be able to fill out the rest of the details about your algo!
          </div>
          <div className="upload-algo-modal__input-wrapper">
            <div className="upload-algo-modal__input-wrapper__label">
              Price
            </div>
            <input
              type="number"
              className="upload-algo-modal__input-wrapper__input"
              onChange={e => this.setState({ price: e.target.value })}
              value={this.state.price}
            />
          </div>
        </div>
        <div className="upload-algo-modal__footer">
          <div className="upload-algo-modal__error">
            {this.state.error}
          </div>
          <button
            className="upload-algo-modal__create-btn"
            onClick={this.createAlgo}
          >
            Create Algorithm Contract
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Modal onClose={this.props.onClose}>
        {this.renderContent()}
      </Modal>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    addAlgo: price => dispatch(actions.createAlgo(price)),
  }),
)(UploadAlgoModal);
