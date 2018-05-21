import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/algorithmns';
import { withRouter } from 'react-router';
import UpdateAlgoModal from './update-algo-modal';

class AlgoRow extends Component {
  static propTypes = {
    // Own Props -- passed from request/index.js
    address: PropTypes.string.isRequired,

    // Redux
    getAlgoData: PropTypes.func.isRequired,
    algoData: PropTypes.object,
  };

  state = {
    isShowingModal: false,
  }

  componentWillMount() {
    this.props.getAlgoData();
  }

  closeModal = () => {
    this.setState({ isShowingModal: false });
  }

  renderModal() {
    if (!this.state.isShowingModal) {
      return null;
    }

    return (
      <UpdateAlgoModal
        address={this.props.address}
        onClose={() => this.setState({ isShowingModal: false })}
      />
    );
  }

  render() {
    const { algoData, history } = this.props;
    const data = algoData || {
      thumbnail: '',
      title: '',
      description: '',
    };

    return (
      <div
        className={classnames('upload__algo-row', {
          'upload__algo-row--loading': !algoData,
        })}
        onClick={() => this.setState({ isShowingModal: true })}
      >
        <div
          className="upload__algo-row__hero-image"
          style={{
            backgroundImage: data.thumbnail && `url(${data.thumbnail})`,
          }}
        />
        <div className="upload__algo-row__content">
          <div className="upload__algo-row__title">
            {algoData && (data.title || 'No title')}
          </div>
          <div className="upload__algo-row__description">
            {algoData && (data.description || 'No description')}
          </div>
        </div>
        <div className="upload__algo-row__footer">
          <div className="upload__algo-row__status">
            Pending Review
          </div>
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

export default withRouter(
  connect(
    (state, { address }) => ({
      algoData: state.algorithmns.map[address],
    }),
    (dispatch, ownProps) => ({
      getAlgoData: () => dispatch(actions.getAlgoData(ownProps.address)),
    })
  )(AlgoRow)
);
