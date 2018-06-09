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

  /***
  <div
    className="upload__algo-row__hero-image"
    style={{
      backgroundImage: data.thumbnail && `url(${data.thumbnail})`,
    }}
  />
  */

  renderCost() {
    const { algoData } = this.props;
    const { cost } = algoData || {};

    if (!cost) {
      return null;
    }

    return (
      <div className="upload__algo-row__cost">
        <span className="upload__algo-row__cost__value">
          {cost/(1000000000000000000)}
        </span>
        <span className="upload__algo-row__cost__unit">
          DML
        </span>
      </div>
    );
  }

  renderStatus() {
    const { algoData } = this.props;
    const {
      isActive,
      isPendingReview,
    } = algoData || {};

    return (
      <div
        className={classnames('upload__algo-row__status', {
          'upload__algo-row__status--active': isActive,
          'upload__algo-row__status--pending': isPendingReview,
          'upload__algo-row__status--inactive': !isActive && !isPendingReview,
        })}
      >
        {
          isActive
            ? 'Active'
            : isPendingReview
              ? 'Pending Review'
              : 'Inactive'
        }
      </div>
    );
  }

  render() {
    const { algoData } = this.props;
    const {
      title,
      description,
      earning,
    } = algoData || {};

    return (
      <div
        className={classnames('upload__algo-row', {
          'upload__algo-row--loading': !algoData,
        })}
        onClick={() => this.setState({ isShowingModal: true })}
      >
        <div className="upload__algo-row__content">
          <div className="upload__algo-row__title">
            {algoData && (title || 'No title')}
          </div>
          <div className="upload__algo-row__description">
            {algoData && (description || 'No description')}
          </div>
          <div className="upload__algo-row__content-bottom">
            {this.renderStatus()}
            {this.renderCost()}
          </div>
        </div>
        <div className="upload__algo-row__footer">
          {
            earning
              ? `Earned ${earning} DML`
              : `No Earning Yet`
          }
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
