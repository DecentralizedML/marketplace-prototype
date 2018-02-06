import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import loadImage from 'blueimp-load-image';
import { imagenetClassesTopK } from '../../utils/imagenet';
import { buyAlgo } from '../../ducks/algorithmns';


const KerasJS = window.KerasJS;

class ImageRecognition extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    stars: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    downloads: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    isPurchased: PropTypes.bool.isRequired,
  };

  state = {
    file: null,
    imageError: null,
    result: null,
    isAnalyzing: false,
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

  analyze = async () => {
    const { file } = this.state;
    const canvas = document.createElement('canvas');
    canvas.width = 299;
    canvas.height = 299;
    const context = canvas.getContext('2d');
    const img = document.createElement('img');

    img.onload = async () => {
      this.setState({ isAnalyzing: true });

      if (!this.model) {
        this.model = new KerasJS.Model({
          filepath: this.props.model,
          gpu: KerasJS.GPU_SUPPORT,
        });
      }

      loadImage(
        file,
        async img => {
          if (img.type === 'error') {
            this.setState({
              result: null,
              imageError: 'Cannot load image',
              isAnalyzing: false,
            });
          } else {
            // load image data onto input canvas
            context.drawImage(img, 0, 0);
            // model predict
            const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

            const { data, width, height } = imageData
            // data processing
            // see https://github.com/keras-team/keras/blob/master/keras/applications/imagenet_utils.py
            const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
            const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3]);
            ops.divseq(dataTensor, 127.5);
            ops.subseq(dataTensor, 1);
            ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 0));
            ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1));
            ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 2));
            const preprocessedData = dataProcessedTensor.data;

            try {
              await this.model.ready()
              const inputData = {
                input_1: preprocessedData
              }
              const outputData = await this.model.predict(inputData);
              const output = outputData[this.model.outputLayerNames[0]];
              const result = imagenetClassesTopK(output, 5);
              this.setState({
                result,
                imageError: null,
                isAnalyzing: false,
              });
            } catch (err) {
              this.setState({
                result: null,
                imageError: err.message,
                isAnalyzing: false,
              });
            }
          }
        },
        {
          maxWidth: 299,
          maxHeight: 299,
          cover: true,
          crop: true,
          canvas: true,
          crossOrigin: 'Anonymous'
        }
      );
    }

    img.src = file;
  }

  clear = () => {
    this.setState({
      file: null,
      imageError: null,
      result: null,
    });
  }

  renderRight() {
    const { file, imageError, result, isAnalyzing } = this.state;

    if (isAnalyzing) {
      return (
        <div className="algo-modal__results">
          <div className="algo-modal__has-image">
            <div className="algo-modal__spinner" />
            <div className="algo-modal__loading-text">Analyzing...</div>
          </div>
        </div>
      );
    }

    if (imageError) {
      return (
        <div className="algo-modal__results">
          <div className="algo-modal__has-image">
            {imageError}
            <button
              className="algo-modal__btn-secondary"
              onClick={this.clear}
            >
              Upload New Image
            </button>
          </div>
        </div>
      );
    }

    if (result) {
      return (
        <div className="algo-modal__results">
          <div className="algo-modal__has-image">
            <div className="algo-modal__result-wrapper">
              {result.map(({ id, name, probability }) => {
                return (
                  <div className="algo-modal__result" key={id}>
                    <div className="algo-modal__prob-bar" style={{ width: `${(probability*100).toFixed(2)}%` }} />
                    <div className="algo-modal__result-probability">{`${(probability*100).toFixed(2)}%`}</div>
                    <div className="algo-modal__result-name">{name}</div>
                  </div>
                );
              })}
            </div>
            <button
              className="algo-modal__btn-secondary"
              onClick={this.clear}
            >
              Upload New Image
            </button>
          </div>
        </div>
      );
    }
    return file
      ? (
        <div className="algo-modal__results">
          <div className="algo-modal__has-image">
            <button
              className="algo-modal__btn-primary"
              onClick={this.analyze}
            >
              Analyze
            </button>
            <button
              className="algo-modal__btn-secondary"
              onClick={this.clear}
            >
              Upload New Image
            </button>
          </div>
        </div>
      )
      : (
        <div className="algo-modal__results">
          <div className="algo-modal__no-image-text">
            Please upload an image on the left.
          </div>
        </div>
      );
  }

  getBuyButtonText() {
    const { isPurchased, isPurchasePending } = this.props;

    if (isPurchasePending) {
      return 'Pending Purchase';
    }

    if (isPurchased) {
      return 'Purchased';
    }

    return 'Buy';
  }

  render() {
    const { title, thumbnail, stars, description, downloads, onClose, isPurchased, isPurchasePending  } = this.props;

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
            <button
              className="algo-modal__buy-btn"
              disabled={isPurchased || isPurchasePending}
              onClick={() => {
                const { id, buyAlgo } = this.props;
                buyAlgo(Number(id));
              }}
            >
              {this.getBuyButtonText()}
            </button>
          </div>
          <div
            className="algo-modal__close"
            onClick={onClose}
          />
        </div>
        <div className="algo-modal__content">
          <div className="algo-modal__image-recognition">
            { isPurchased && this.renderLeft() }
            { isPurchased && this.renderRight() }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ algorithmns }, { id }) => ({
    isPurchased: typeof algorithmns.purchased[id] === 'string'
      ? false
      : Boolean(algorithmns.purchased[id]),
    isPurchasePending: typeof algorithmns.purchased[id] === 'string',
  }),
  dispatch => ({
    buyAlgo: id => dispatch(buyAlgo(id)),
  }),
)(ImageRecognition);
