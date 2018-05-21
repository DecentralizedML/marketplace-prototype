import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/algorithmns';
import UploadAlgoModal from './upload-algo-modal';
import AlgoRow from './algo-row';

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
          {this.props.myAlgos.map(address => <AlgoRow key={address} address={address} />)}
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

export default connect(
  state => ({
    myAlgos: state.algorithmns.myAlgos,
  }),
  dispatch => ({
    fetchMyAlgos: () => dispatch(actions.fetchMyAlgos()),
  }),
)(Upload);
