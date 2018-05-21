import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import loadImage from 'blueimp-load-image';
import * as actions from '../../ducks/algorithmns';
import Modal from '../ui/modal';
import { imagenetClassesTopK } from '../../utils/imagenet';

import './update-algo-modal.css';

const KerasJS = window.KerasJS;

class UpdateAlgoModal extends Component {
  static propTypes = {

  };

  state = {
    title: '',
    description: '',
    type: 'image_recognition',
    algoFile: null,
  };

  updateAlgo = () => {
    const { title, description, type } = this.state;
    let error = '';

    if (!title) {
      error = 'Title cannot be empty.';
    }

    if (!description) {
      error = 'Description cannot be empty';
    }

    if (error) {
      return this.setState({
        error,
      });
    }
  }

  analyze = () => {
    const { file, algoFile } = this.state;
    console.log(this.model)
    if (!this.model) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 299;
    canvas.height = 299;
    const context = canvas.getContext('2d');
    const img = document.createElement('img');

    img.onload = async () => {
      this.setState({ isAnalyzing: true });

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
              console.log({result})
              this.setState({
                result,
                imageError: null,
                isAnalyzing: false,
              });
            } catch (err) {
              console.log({err})
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

  renderLeft() {
    if (this.state.file) {
      return (
        <div className="update-algo-modal__algo-test__left">
          <div
            className="algo-modal__uploaded-image"
            style={{ backgroundImage: `url(${this.state.file})`}}
          />
        </div>
      );
    }

    return (
      <div className="update-algo-modal__algo-test__left">
        <div className="update-algo-modal__algo-test__upload-btn" />
        <input
          className="update-algo-modal__algo-test__upload-input"
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
    );
  }

  renderRight() {
    const { file, algoFile, result, isAnalyzing } = this.state;

    if (isAnalyzing) {
      return (
        <div className="update-algo-modal__algo-test__right">
          <div className="algo-modal__has-image">
            <div className="algo-modal__spinner" />
            <div className="algo-modal__loading-text">Analyzing...</div>
          </div>
        </div>
      );
    }

    if (result) {
      return (
        <div className="update-algo-modal__algo-test__right">
          <div className="update-algo-modal__algo-test__right__result-wrapper">
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
            onClick={() => this.setState({ file: '' })}
          >
            Upload New Image
          </button>
        </div>
      );
    }

    return (
      <div className="update-algo-modal__algo-test__right">
        <button
          className="algo-modal__btn-primary"
          disabled={!algoFile || !file}
          onClick={this.analyze}
        >
          Analyze
        </button>
        <button
          className="algo-modal__btn-secondary"
          onClick={() => this.setState({ file: '' })}
        >
          Upload New Image
        </button>
      </div>
    );
  }

  renderContent() {
    return (
      <div className="update-algo-modal" onClick={e => e.stopPropagation()}>
        <div className="update-algo-modal__header">
          Update Algorithm
        </div>
        <div className="update-algo-modal__content">
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Title
            </div>
            <input
              type="text"
              className="update-algo-modal__input-wrapper__input"
              onChange={e => this.setState({ title: e.target.value })}
              value={this.state.title}
            />
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Description
            </div>
            <input
              type="text"
              className="update-algo-modal__input-wrapper__input"
              onChange={e => this.setState({ description: e.target.value })}
              value={this.state.description}
            />
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Type
            </div>
            <select
              className="update-algo-modal__input-wrapper__input"
              onChange={e => this.setState({ type: e.target.value })}
              value={this.state.type}
            >
              <option value="image_recognition">Image Recognition</option>
              <option value="text">Text Analysis</option>
            </select>
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              File (*.bin)
            </div>
            <input
              type="file"
              className="update-algo-modal__input-wrapper__input"
              onChange={e => {
                const algoFile = e.target.files[0];

                this.setState({ algoFile });

                const reader = new FileReader();

                reader.addEventListener('load', e => {
                  this.model = new KerasJS.Model({
                    filepath: e.target.result,
                    gpu: KerasJS.GPU_SUPPORT,
                  });
                });

                reader.readAsDataURL(algoFile);
              }}
            />
          </div>
          <div className="update-algo-modal__algo-test">
            {this.renderLeft()}
            {this.renderRight()}
          </div>
        </div>
        <div className="update-algo-modal__footer">
          <div className="update-algo-modal__error">
            {this.state.error}
          </div>
          <button
            className="update-algo-modal__create-btn"
            onClick={this.updateAlgo}
          >
            Update Algorithm
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

  }),
)(UpdateAlgoModal);
