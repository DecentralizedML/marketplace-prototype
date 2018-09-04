import React, { Component } from 'react';
import { connect } from 'react-redux';
// import classnames from 'classnames';
import PropTypes from 'prop-types';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import loadImage from 'blueimp-load-image';
import * as actions from '../../ducks/algorithms';
import Modal from '../components/modal';
import CodeBox from '../components/code-box';
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

    this.state = {
      title               : props.algoData.title || '',
      description         : props.algoData.description || '',
      type                : props.algoData.type || 'image_recognition',
      algoFile            : props.algoData.algoFile || null,
      preprocessing       : props.algoData.preprocessing || this.getDefaultPreprocessing(),
      postprocessing      : props.algoData.postprocessing || this.getDefaultPostprocessing(),
      isInitializingModel : false,
      outputProcessing    : props.algoData.outputProcessing || '',
      isUpdating          : false,
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage)
  }

  getDefaultPreprocessing = () => {
    return `function preprocessing (imageData, width, height) {
  // data in the RGBA order (meaning pixels are groups of four values)
  console.log('preprocessing', imageData[0], width, height);
  return imageData;
}`
  }

  getDefaultPostprocessing = () => {
    return `function postprocessing (results) {
  console.log('postprocessing', Object.keys(results));
  return Object.keys(results);
}`
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

  analyzeImage = async () => {
    const {
      // file,
      fileData,
      // algoFile
    } = this.state;

    // if there is no file data to work with,
    // or if there is no model to run,
    // bail out
    if (!fileData || !this.model) {
      return null;
    }

    this.setState({ isAnalyzing: true });

    const { data, width, height } = fileData.imageData;

    // data processing
    // see https://github.com/keras-team/keras/blob/master/keras/applications/imagenet_utils.py
    const dataTensor          = ndarray(new Float32Array(data), [width, height, 4]);
    const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3]);

    ops.divseq(dataTensor, 127.5);
    ops.subseq(dataTensor, 1);
    ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 0));
    ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1));
    ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 2));

    const preprocessedData = dataProcessedTensor.data;

    try {
      await this.model.ready();

      const inputData = {
        input_1: preprocessedData
      };

      const outputData = await this.model.predict(inputData);
      const url = `data:text/plain;charset=utf-8,${JSON.stringify(outputData)}`;

      // const output = outputData[this.model.outputLayerNames[0]];
      // const result = imagenetClassesTopK(output, 5);
      // console.log({result})

      this.setState({
        result      : url,
        resultData  : outputData,
        imageError  : null,
        isAnalyzing : false,
      });
    } catch (err) {
      this.setState({
        result      : null,
        resultData  : null,
        imageError  : err.message,
        isAnalyzing : false,
      });
    }
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

  onImageUpload = (event) => {
    // get File object containing name, size, type, lastModifiedDate, etc.
    const file = event.target.files[0];

    // instantiate FileReader
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      loadImage(
        file,
        async (canvas) => {
          if (canvas.type === 'error') {
            this.setState({
              result      : null,
              resultData  : null,
              imageData   : {},
              imageError  : 'Cannot load image',
              isAnalyzing : false,
            });
          } else {
            const context   = canvas.getContext('2d');
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            this.setState({
              file: reader.result, // base64-ish string representation of the image
              fileData: {
                imageData, // pixel data, has `data`, `width`, and `height` properties
              },
            });
          }
        },
        {
          maxWidth    : 299,
          maxHeight   : 299,
          cover       : true,
          crop        : true,
          canvas      : true,
          crossOrigin : 'Anonymous',
        }
      );
    };

    // read File as a base64 string
    // and then trigger the `onload` handler above
    reader.readAsDataURL(file);
  }

  onAlgoUpload = (event) => {
    const algoFile = event.target.files[0];

    this.setState({
      isInitializingModel: true,
      algoFile,
    });

    const reader = new FileReader();

    reader.addEventListener('load', readerEvent => {
      this.model = new KerasJS.Model({
        filepath: readerEvent.target.result,
        gpu: this.state.type === 'image_recognition'
          ? KerasJS.GPU_SUPPORT
          : false,
      });

      this.setState({
        isInitializingModel : false,
        result              : null,
        resultData          : null,
        // file                : null,
      });
    });

    reader.readAsDataURL(algoFile);
  }

  renderUploadLeft = () => {
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

    // once you've uploaded an image
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

    // on default load without having uploaded an image
    return (
      <div className="update-algo-modal__algo-test__left">
        <div className="update-algo-modal__algo-test__upload-btn" />
        <input
          className="update-algo-modal__algo-test__upload-input"
          type="file"
          accept="image/*"
          onChange={this.onImageUpload}
        />
      </div>
    );
  }

  renderUploadRight() {
    const fileInfo = () => {
      if (this.state.fileData) {
        const width  = this.state.fileData.imageData.width;
        const height = this.state.fileData.imageData.height;

        return (
          <dl>
            <dt>Height</dt><dd>{height}px</dd>
            <dt>Width</dt><dd>{width}px</dd>
          </dl>
        );
      }

      return null;
    };

    return (
      <div className="update-algo-modal__algo-test__right">
        {fileInfo()}
        <button
          className="algo-modal__btn-secondary"
          onClick={() => this.setState({ file: '', fileData: null, result: null, resultData: null })}
        >
          Upload New Image
        </button>
      </div>
    );
  }

  renderAnalyze() {
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
      </div>
    );
  }

  renderFinalDownload = () => {
    const { postprocessingResults } = this.state;

    if (postprocessingResults) {
      const url = `data:text/plain;charset=utf-8,${JSON.stringify(postprocessingResults)}`;

      return (
        <div className="update-algo-modal__algo-test__right">
          <div className="update-algo-modal__algo-test__right__result-wrapper">
            <a href={url} download="final_results.txt">Download Final Results</a>
          </div>
        </div>
      );
    }
  }

  getPreprocessingBeforeCode = () => {
    let preprocessingBeforeCode = '';

    if (this.state.type === 'image_recognition') {
      if (this.state.fileData && this.state.fileData.imageData) {
        preprocessingBeforeCode = `
          const INPUT = {
            data: ${JSON.stringify(this.state.fileData.imageData.data)},
            height: ${this.state.fileData.imageData.height},
            width: ${this.state.fileData.imageData.width},
          };
        `;
      }
    }

    return preprocessingBeforeCode;
  }

  getPreprocessingAfterCode = () => {
    let preprocessingAfterCode = '';

    if (this.state.type === 'image_recognition') {
      preprocessingAfterCode = `
        if (INPUT && INPUT.data && INPUT.width && INPUT.height) {
          const OUTPUT = preprocessing(INPUT.data, INPUT.width, INPUT.height);
          window.parent.postMessage({
            type    : 'preprocessingResults',
            payload : OUTPUT,
          }, '*');
        }
      `;
    }

    return preprocessingAfterCode;
  }

  getPostprocessingBeforeCode = () => {
    let postprocessingBeforeCode = '';

    if (this.state.type === 'image_recognition') {
      if (this.state.result) {
        postprocessingBeforeCode = `
          const INPUT = {
            data: ${JSON.stringify(this.state.resultData)},
          };
        `;
      }
    }

    return postprocessingBeforeCode;
  }

  getPostprocessingAfterCode = () => {
    let postprocessingAfterCode = '';

    if (this.state.type === 'image_recognition') {
      postprocessingAfterCode = `
        if (INPUT && INPUT.data) {
          const OUTPUT = postprocessing(INPUT.data);
          window.parent.postMessage({
            type    : 'postprocessingResults',
            payload : OUTPUT,
          }, '*');
        }
      `;
    }

    return postprocessingAfterCode;
  }

  handleMessage = (event) => {
    const validTypes = ['preprocessingResults', 'postprocessingResults'];
    if (validTypes.indexOf(event.data.type) > - 1) {
      this.setState({
        [event.data.type]: event.data.payload,
      });
    }
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
            <div className="update-algo-modal__algo-test">
              {this.renderUploadLeft()}
              {this.renderUploadRight()}
            </div>
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Pre-processing
            </div>
            <CodeBox
              name="preprocessing"
              beforeCode={this.getPreprocessingBeforeCode()}
              code={this.state.preprocessing}
              afterCode={this.getPreprocessingAfterCode()}
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
              onChange={this.onAlgoUpload}
            />
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__algo-test">
              {this.renderAnalyze()}
            </div>
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Post-processing
            </div>
            <CodeBox
              name="postprocessing"
              beforeCode={this.getPostprocessingBeforeCode()}
              code={this.state.postprocessing}
              afterCode={this.getPostprocessingAfterCode()}
              onChange={(newValue) => this.setState({ postprocessing: newValue })}
            />
          </div>
          <div className="update-algo-modal__input-wrapper">
            <div className="update-algo-modal__input-wrapper__label">
              Download postprocessed results
            </div>
            {this.renderFinalDownload()}
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
