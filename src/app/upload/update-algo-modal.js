import React, { Component } from 'react';
import { connect } from 'react-redux';
// import classnames from 'classnames';
import PropTypes from 'prop-types';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import loadImage from 'blueimp-load-image';
import * as actions from '../../ducks/algorithms';
import Modal from '../components/modal';
import CodeEditor from '../components/code-editor';
// import { imagenetClassesTopK } from '../../utils/imagenet';

import './update-algo-modal.css';

const KerasJS = window.KerasJS;

class UpdateAlgoModal extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    updateAlgo: PropTypes.func.isRequired,
    // Redux
    algoData: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const defaultPreprocessing = 'function preprocessing (input) {\n  console.log(input);\n}';
    const defaultPostprocessing = 'function postprocessing (input) {\n  console.log(input); \n}';

    this.state = {
      title: props.algoData.title || '',
      description: props.algoData.description || '',
      type: props.algoData.type || 'image_recognition',
      algoFile: props.algoData.algoFile || null,
      preprocessing: props.algoData.preprocessing || defaultPreprocessing,
      postprocessing: props.algoData.postprocessing || defaultPostprocessing,
      isInitializingModel: false,
      outputProcessing: props.algoData.outputProcessing || '',
      isUpdating: false,
    }
  }

  updateAlgo = () => {
    this.setState({ isUpdating: true });
    const { title, description, type, algoFile, outputProcessing, preprocessing, postprocessing } = this.state;
    let error = '';

    if (!title) {
      error = 'Title cannot be empty.';
    }

    if (!description) {
      error = 'Description cannot be empty.';
    }

    if (!algoFile) {
      error = 'Must upload algorithm.';
    }

    if (!outputProcessing) {
      error = 'Please describe how the output should be processed.';
    }

    if (error) {
      return this.setState({
        error,
        isUpdating: false,
      });
    }

    this.props
      .updateAlgo({
        title,
        description,
        file: algoFile,
        type,
        outputProcessing,
        preprocessing,
        postprocessing,
        address: this.props.address,
      })
      .then(this.props.onClose)
      .catch(e => this.setState({ isUpdating: e.message }))
  }

  analyzeImage = () => {
    const {
      file,
      // algoFile
    } = this.state;

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
              // const output = outputData[this.model.outputLayerNames[0]];
              const url = `data:text/plain;charset=utf-8,${JSON.stringify(outputData)}`;
              // const result = imagenetClassesTopK(output, 5);
              // console.log({result})
              this.setState({
                result: url,
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

  analyzeText = async text => {
    // if (!this.model) {
    //   return null;
    // }

    // if (!text) {
    //   return this.setState({
    //     textError: null,
    //     result: null,
    //     isAnalyzing: false,
    //   });
    // }

    // this.setState({
    //   textError: null,
    //   result: null,
    //   isAnalyzing: true,
    // });

    // const value = new Float32Array(MAXLEN);

    // const parsedText = text
    //   .trim()
    //   .toLowerCase()
    //   .split(/[\s.,!?]+/gi);

    // let indices = parsedText.map(word => {
    //   const index = WORD_INDEX[word];
    //   return !index ? OOV_WORD_INDEX : index + INDEX_FROM;
    // });

    // indices = [START_WORD_INDEX].concat(indices)
    // indices = indices.slice(-MAXLEN)

    // // padding and truncation (both pre sequence)
    // const start = Math.max(0, MAXLEN - indices.length);
    // for (let i = start; i < MAXLEN; i++) {
    //   value[i] = indices[i - start];
    // }

    // try {
    //   await this.model.ready();
    //   const outputData = await this.model.predict({ input: value });
    //   // const [result] = new Float32Array(outputData.output);
    //   const url = `data:text/plain;charset=utf-8,${JSON.stringify(outputData)}`;
    //   this.setState({
    //     textError: null,
    //     result: url,
    //     isAnalyzing: false,
    //   });
    // } catch (err) {
    //   this.setState({
    //     textError: err.message,
    //     result: null,
    //     isAnalyzing: false,
    //   });
    // }
  }

  analyze = text => {
    const { type } = this.state;

    if (type === 'image_recognition') {
      return this.analyzeImage();
    } else {
      return this.analyzeText(text);
    }
  }

  renderLeft() {
    if (this.state.type === 'text') {
      return (
        <div className="update-algo-modal__algo-test__left">
          <textarea
            style={{ height: '100%' }}
            className="algo-modal__text-area"
            onChange={e => this.analyze(e.target.value)}
            placeholder="Enter text here..."
          />
        </div>
      );
    }

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
            <a href={result} download="result.txt">Download Result</a>
          </div>
          <button
            className="algo-modal__btn-secondary"
            onClick={() => this.setState({ file: '', result: null })}
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
          onClick={() => this.setState({ file: '', result: null })}
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
              {/*<option value="text">Text Analysis</option>*/}
            </select>
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Pre-processing
            </div>
            <CodeEditor
              name='preprocessing'
              value={this.state.preprocessing}
              onChange={(newValue) => this.setState({ preprocessing: newValue })}
            />
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              {`File (*.bin)${this.state.isInitializingModel ? ' - Loading Model...' : ''}`}
            </div>
            <input
              type="file"
              className="update-algo-modal__input-wrapper__input"
              onChange={e => {
                const algoFile = e.target.files[0];

                this.setState({ algoFile, isInitializingModel: true });

                const reader = new FileReader();

                reader.addEventListener('load', e => {
                  this.model = new KerasJS.Model({
                    filepath: e.target.result,
                    gpu: this.state.type === 'image_recognition'
                      ? KerasJS.GPU_SUPPORT
                      : false,
                  });

                  this.setState({
                    isInitializingModel: false,
                    result: null,
                    file: null,
                  });
                });

                reader.readAsDataURL(algoFile);
              }}
            />
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Post-processing
            </div>
            <CodeEditor
              name='postprocessing'
              value={this.state.postprocessing}
              onChange={(newValue) => this.setState({ postprocessing: newValue })}
            />
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Describe how your output should be interpreted
            </div>
            <textarea
              className="update-algo-modal__input-wrapper__input"
              onChange={e => this.setState({ outputProcessing: e.target.value })}
              value={this.state.outputProcessing}
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
  (state, { address }) => ({
    algoData: state.algorithms.map[address],
  }),
  dispatch => ({
    updateAlgo: data => dispatch(actions.updateAlgo(data)),
  }),
)(UpdateAlgoModal);
