import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/bounties';
import Modal from '../ui/modal';

import './create-bounty-modal.css';

class CreateBountyModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    isCreatingBounty: PropTypes.bool.isRequired,
    createNewBounty: PropTypes.func.isRequired,
  };

  state = {
    title: '',
    prizes: ['', '', '', '', ''],
    error: '',
    isSubmitted: false,
  }

  renderTitleInput() {
    return (
      <div className="create-bounty-modal__input-wrapper">
        <div className="create-bounty-modal__input-wrapper__label">
          Title
        </div>
        <input
          type="text"
          className="create-bounty-modal__input-wrapper__input"
          onChange={e => this.setState({ title: e.target.value })}
          value={this.state.title}
        />
      </div>
    );
  }

  setPrize = (index, value) => {
    this.setState({
      prizes: this.state.prizes.map((prize, i) => i === index ? value : prize),
    });
  }

  isValid = () => {
    const { title, prizes } = this.state;

    let error = '';

    prizes.reduce((l, p) => {
      const prize = Number(p);
      const last = Number(l);
      if (prize < 0) {
        error = 'Prize cannot be negative';
      }

      if (prize > last && !!prize) {
        error = 'Prizes must be in descending order';
      }

      return prize;
    }, Infinity);

    if (!prizes[0]) {
      error = 'Must have at least one prize';
    }

    if (!title) {
      error = 'Title cannot be empty';
    }

    this.setState({ error });

    return !error;
  }

  onCreate = () => {
    const { title, prizes } = this.state;

    if (!this.props.isCreatingBounty && this.isValid()) {
      this.props.createNewBounty(title, prizes.map(prize => prize * 1000000000000000000).filter(d => !!d))
        .then(() => {
          this.setState({
            title: '',
            prizes: ['', '', '', '', ''],
            error: '',
            isSubmitted: true,
          });
        })
        .catch(e => {
          if ((/User denied transaction/gi).test(e.message)) {
            this.setState({ error: 'MetaMask - User denied transaction' });
          } else {
            this.setState({ error: e.message });
          }
        });
    };
  }

  renderPrizeInput(prize, i) {
    return (
      <input
        key={i}
        type="number"
        className="create-bounty-modal__input-wrapper__input"
        placeholder={`#${i + 1} - ${i === 0 ? 'Required' : 'Optional'}`}
        onChange={e => this.setPrize(i, e.target.value)}
        value={this.state.prizes[i]}
      />
    );
  }

  renderPrizesInput() {
    return (
      <div className="create-bounty-modal__input-wrapper">
        <div className="create-bounty-modal__input-wrapper__label">
          Prizes
        </div>
        <div className="create-bounty-modal__prize-inputs">
          {this.state.prizes.map((prize, i) => (
            this.renderPrizeInput(prize, i)
          ))}
        </div>
      </div>
    );
  }

  renderContent() {
    if (this.state.isSubmitted) {
      return (
        <div className="create-bounty-modal--submitted" onClick={e => e.stopPropagation()}>
          <div className="create-bounty-modal__content create-bounty-modal__content--submitted">
            <div className="create-bounty-modal__success">
              Your bounty contract is deployed! It will take about 1 minute before it shows up on your account.
            </div>
          </div>
          <div className="create-bounty-modal__footer">
            <button
              className="create-bounty-modal__create-btn"
              onClick={this.props.onClose}
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="create-bounty-modal" onClick={e => e.stopPropagation()}>
        <div className="create-bounty-modal__header">
          Create a New Bounty
        </div>
        <div className="create-bounty-modal__content">
          <div className="create-bounty-modal__instruction">
            This will deploy a Bounty contract to the Ethereum network. After the contract deployed, you will be able to fill out the rest of the details about your bounty!
          </div>
          {this.renderTitleInput()}
          {this.renderPrizesInput()}
        </div>
        <div className="create-bounty-modal__footer">
          <div className="create-bounty-modal__error">
            {this.state.error}
          </div>
          <button
            className="create-bounty-modal__create-btn"
            onClick={this.onCreate}
            disabled={this.props.isCreatingBounty}
          >
            Create New Bounty
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
  state => ({
    isCreatingBounty: state.bounties.isCreatingBounty,
  }),
  dispatch => ({
    createNewBounty: (name, prizes) => dispatch(actions.createNewBounty(name, prizes)),
  })
)(CreateBountyModal);
