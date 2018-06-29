import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Modal from '../components/modal';
import ImageRecognition from './image-recognition';
import TextAnalyzer from './text-analyzer';
import { getPurchasedState, getAlgoData } from '../../ducks/algorithms';

class AlgoCard extends Component {

  static propTypes = {
    address: PropTypes.string.isRequired,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    stars: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    type: PropTypes.string,
    model: PropTypes.string,
    downloads: PropTypes.number,
    isActive: PropTypes.bool,
    isPurchased: PropTypes.bool,
    getPurchasedState: PropTypes.func.isRequired,
    algoData: PropTypes.object,
  };

  state = {
    isShowingModal: false,
  };

  componentWillMount() {
    const { getPurchasedState, getAlgoData } = this.props;
    getPurchasedState();
    getAlgoData();
  }

  closeModal = e => {
    e.stopPropagation();
    this.setState({ isShowingModal: false });
  }

  renderModal() {
    if (!this.state.isShowingModal) {
      return null;
    }

    const {
      address,
      title,
      thumbnail,
      stars,
      description,
      downloads,
      type,
      model,
      cost,
      isPurchased,
      algoData,
    } = this.props;

    const { algoFileUrl } = algoData || {};

    switch (type) {
      case 'image_recognition':
        return (
          <Modal onClose={this.closeModal}>
            <ImageRecognition
              address={address}
              onClose={this.closeModal}
              title={title}
              thumbnail={thumbnail}
              stars={stars}
              description={description}
              downloads={downloads}
              model={algoFileUrl}
              isPurchased={isPurchased}
              cost={cost}
            />
          </Modal>
        );
      case 'text':
        return (
          <Modal onClose={this.closeModal}>
            <TextAnalyzer
              address={address}
              onClose={this.closeModal}
              title={title}
              thumbnail={thumbnail}
              stars={stars}
              description={description}
              downloads={downloads}
              model={algoFileUrl}
              isPurchased={isPurchased}
              cost={cost}
            />
          </Modal>
        );
      default:
        return (
          <Modal onClose={this.closeModal}>
            <div>Coming soon!</div>
          </Modal>
        );

    }
  }

  render() {
    const { algoData } = this.props;
    const {
      title,
      description,
      thumbnail,
      stars = 0,
      downloads = 0,
      isActive,
      isPendingReview,
    } = algoData || {};

    if ((!isActive && !isPendingReview) || (!title && !thumbnail)) {
      return <noscript />;
    }

    return (
      <div
        className={classnames('marketplace__algo-card', {
          'marketplace__algo-card--disabled': !isActive,
        })}
        onClick={() => this.setState({ isShowingModal: isActive })}
      >
        {
          isPendingReview && (
            <div className="marketplace__algo-card__disable-text">
              Coming Soon
            </div>
          )
        }
        <div
          className="marketplace__algo-card__hero-image"
          // Hiding hero image until there are more algorithm in the marketplace (50+)

          style={{ backgroundImage: `url(${thumbnail})`, display: 'none' }}
        />
        <div className="marketplace__algo-card__content">
          <div className="marketplace__algo-card__title">{title}</div>
          <div className="marketplace__algo-card__description">{description}</div>
          <div className="marketplace__algo-card__stars">{`${stars} (${downloads})`}</div>
        </div>
        { this.renderModal() }
      </div>
    );
  }
}

export default connect(
  ({ algorithms }, { address }) => ({
    isPurchased: typeof algorithms.purchased[address] === 'string'
      ? false
      : Boolean(algorithms.purchased[address]),
    algoData: algorithms.map[address],
    isPurchasePending: typeof algorithms.purchased[address] === 'string',
  }),
  (dispatch, { address }) => ({
    getPurchasedState: () => dispatch(getPurchasedState(address)),
    getAlgoData: () => dispatch(getAlgoData(address)),
  }),
)(AlgoCard);
