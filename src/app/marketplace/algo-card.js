import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from '../ui/modal';

class AlgoCard extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    stars: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    downloads: PropTypes.number.isRequired,
  };

  state = {
    isShowingModal: false,
  };

  closeModal = e => {
    e.stopPropagation();
    this.setState({ isShowingModal: false });
  }

  renderModal() {
    if (!this.state.isShowingModal) {
      return null;
    }

    const { title, thumbnail, stars, description, downloads } = this.props;

    return (
      <Modal onClose={this.closeModal}>
        <div className="algo-modal" onClick={e => e.stopPropagation()}>
          <div className="algo-modal__header">
            <div
              style={{ backgroundImage: `url(${thumbnail})` }}
              className="algo-modal__image"
            />
            <div className="algo-modal__header-content">
              <div className="algo-modal__header-title">{title}</div>
              <div className="algo-modal__header-description">{description}</div>
              <div className="marketplace__algo-card__stars">{`${stars} (${downloads})`}</div>
            </div>
            <div className="algo-modal__actions">
              <button className="algo-modal__buy-btn">Buy</button>
            </div>
            <div
              className="algo-modal__close"
              onClick={this.closeModal}
            />
          </div>
          <div className="algo-modal__content">

          </div>
        </div>
      </Modal>
    );
  }

  render() {
    const { title, thumbnail, stars, downloads } = this.props;

    return (
      <div
        className="marketplace__algo-card"
        onClick={() => this.setState({ isShowingModal: true })}
      >
        <div
          className="marketplace__algo-card__hero-image"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <div className="marketplace__algo-card__content">
          <div className="marketplace__algo-card__title">{title}</div>
          <div className="marketplace__algo-card__stars">{`${stars} (${downloads})`}</div>
        </div>
        { this.renderModal() }
      </div>
    );
  }
}

export default connect()(AlgoCard);
