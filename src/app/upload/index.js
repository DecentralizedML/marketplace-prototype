import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/algorithms';
import UploadAlgoModal from './upload-algo-modal';
import AlgoRow from './algo-row';

import CodeEditor from '../components/code-editor';

import './index.css';

class Upload extends Component {
  static propTypes = {
    myAlgos: PropTypes.array.isRequired,
    fetchMyAlgos: PropTypes.func.isRequired,
  };

  state = {
    isShowingUploadModal: false,
  };

  componentWillMount() {
    this.props.fetchMyAlgos();
  }

  renderModal() {
    if (this.state.isShowingUploadModal) {
      return (
        <UploadAlgoModal onClose={() => this.setState({ isShowingUploadModal: false })}/>
      );
    }
  }

  renderContent() {
    const { myAlgos = [] } = this.props;

    if (!myAlgos || !myAlgos.length) {
      return (
        <div className="upload__content__empty-text">
          No Upload
        </div>
      );
    }

    return this.props.myAlgos
      .map(address => <AlgoRow key={address} address={address} />);
  }

  renderCodeEditor({ label, name, value = '' }) {
    return (
      <div className="upload__input-row">
        <div className="upload__input-label">{label}</div>
        <div className="upload__input-wrapper">
          <CodeEditor
            name={name}
            value={value}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="upload">
        <div className="upload__header">
          <div className="upload__header-text">My Uploads</div>
          <button
            className="upload__header-action"
            onClick={() => this.setState({ isShowingUploadModal: true })}
          >
            Upload New Algorithm
          </button>
        </div>
        <div className="upload__content">
          {this.renderContent()}
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

export default connect(
  state => ({
    myAlgos: state.algorithms.myAlgos,
  }),
  dispatch => ({
    fetchMyAlgos: () => dispatch(actions.fetchMyAlgos()),
  }),
)(Upload);
