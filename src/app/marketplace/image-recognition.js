import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ImageRecognition extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    stars: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    downloads: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { title, thumbnail, stars, description, downloads, onClose } = this.props;

    return(
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
            onClick={onClose}
          />
        </div>
        <div className="algo-modal__content">
          <div className="algo-modal__image-recognition">
            <div className="algo-modal__image-upload">
              <div className="algo-modal__upload-btn-wrapper">
                <div className="algo-modal__upload-btn" />
                <input className="algo-modal__upload-input" type="file" />
              </div>
            </div>
            <div className="algo-modal__result">
              <div>hi</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
