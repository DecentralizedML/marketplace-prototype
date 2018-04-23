import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Modal from '../ui/modal';
import ImageRecognition from './image-recognition';
import TextAnalyzer from './text-analyzer';
import { getPurchasedState } from '../../ducks/algorithmns';

class AlgoCard extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    stars: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    downloads: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    isPurchased: PropTypes.bool.isRequired,
    getPurchasedState: PropTypes.func.isRequired,
  };

  state = {
    isShowingModal: false,
  };

  componentWillMount() {
    const { getPurchasedState, id } = this.props;
    getPurchasedState(id);
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
      id,
      title,
      thumbnail,
      stars,
      description,
      downloads,
      type,
      model,
      cost,
      isPurchased,
    } = this.props;

    switch (type) {
      case 'image_recognition':
        return (
          <Modal onClose={this.closeModal}>
            <ImageRecognition
              id={id}
              onClose={this.closeModal}
              title={title}
              thumbnail={thumbnail}
              stars={stars}
              description={description}
              downloads={downloads}
              model={model}
              isPurchased={isPurchased}
              cost={cost}
            />
          </Modal>
        );
      case 'text':
        return (
          <Modal onClose={this.closeModal}>
            <TextAnalyzer
              id={id}
              onClose={this.closeModal}
              title={title}
              thumbnail={thumbnail}
              stars={stars}
              description={description}
              downloads={downloads}
              model={model}
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
    const { title, thumbnail, stars, downloads, isActive } = this.props;

    return (
      <div
        className={classnames('marketplace__algo-card', {
          'marketplace__algo-card--disabled': !isActive,
        })}
        onClick={() => this.setState({ isShowingModal: isActive })}
      >
        {
          !isActive && (
            <div className="marketplace__algo-card__disable-text">
              Coming Soon
            </div>
          )
        }
        <div
          className="marketplace__algo-card__hero-image"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <div className="marketplace__algo-card__content">
          <div className="marketplace__algo-card__title">{title}</div>
          <div className="marketplace__algo-card__stars">{`${stars} (${downloads})`}</div>
        </div>
        { this.renderModal() }
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
    getPurchasedState: id => dispatch(getPurchasedState(id)),
  }),
)(AlgoCard);
