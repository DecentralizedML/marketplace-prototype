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

  state = {
    file: null,
  };

  renderLeft() {
    const { file } = this.state;

    return file
      ? (
        <div className="algo-modal__image-upload">
          <div
            className="algo-modal__uploaded-image"
            style={{ backgroundImage: `url(${file})`}}
          />
        </div>
      )
      : (
        <div className="algo-modal__image-upload">
          <div className="algo-modal__upload-btn-wrapper">
            <div className="algo-modal__upload-btn" />
            <input
              className="algo-modal__upload-input"
              type="file"
              accept="image/*"
              onChange={e => {
                const { target: { files: [file ] } } = e;
                const reader = new FileReader();

                reader.onload = e => {
                  this.setState({ file: e.target.result });
                };

                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>
      );
  }

  renderRight() {
    const { file } = this.state;
    return file
      ? (
        <div className="algo-modal__result">
          <div className="algo-modal__has-image">
            <button className="algo-modal__btn-primary">Analyze</button>
            <button
              className="algo-modal__btn-secondary"
              onClick={() => this.setState({ file: null })}
            >
              Upload New Image
            </button>
          </div>
        </div>
      )
      : (
        <div className="algo-modal__result">
          <div className="algo-modal__no-image-text">
            Please upload an image on the left.
          </div>
        </div>
      );
  }

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
            { this.renderLeft() }
            { this.renderRight() }
          </div>
        </div>
      </div>
    );
  }
}
