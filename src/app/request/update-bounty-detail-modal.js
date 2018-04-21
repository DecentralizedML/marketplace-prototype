import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/bounties';
import Modal from '../ui/modal';

const bemify = block => (elem = '', modifier = '') => (
  `${block}${elem && '__' + elem}${modifier && '--' + modifier}`
);

class UpdateBountyDetailModal extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    bountyData: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { bountyData } = props;
    const {
      thumbnailUrl = '',
      imageUrl = '',
      subtitle = '',
      description = '',
      data = '',
      evaluation = '',
      rules = '',
    } = bountyData || {};
    this.state = {
      thumbnailUrl,
      imageUrl,
      subtitle,
      description,
      data,
      evaluation,
      rules,
    };
  }

  handleChange = (key, e) => {
    this.setState({
      [key]: e.target.value,
    });
  }

  submit = () => {
    const {
      thumbnailUrl,
      imageUrl,
      subtitle,
      description,
      data,
      evaluation,
      rules,
    } = this.state;
    const { address, updateBountyDetail } = this.props;

    if (!thumbnailUrl || !imageUrl || !subtitle || !description || !data || !evaluation || !rules || !address) {
      return null;
    }

    updateBountyDetail({
      thumbnailUrl,
      imageUrl,
      subtitle,
      description,
      data,
      evaluation,
      rules,
      address,
    })
  }

  render() {
    const bem = bemify('bounty-page__admin__update-bounty-detail-modal');

    return (
      <Modal onClose={this.props.onClose}>
        <div className={bem()} onClick={e => e.stopPropagation()}>
          <div className={bem('header')}>
            Update Bounty Detail
          </div>
          <div className={bem('content')}>
            <div className={bem('row')}>
              <div className={bemify(bem('row'))('label')}>
                Thumbnail Image URL
              </div>
              <input
                type="text"
                className={bemify(bem('row'))('input')}
                onChange={this.handleChange.bind(this, 'thumbnailUrl')}
                value={this.state.thumbnailUrl}
              />
            </div>
            <div className={bem('row')}>
              <div className={bemify(bem('row'))('label')}>
                Cover Image URL
              </div>
              <input
                type="text"
                className={bemify(bem('row'))('input')}
                onChange={this.handleChange.bind(this, 'imageUrl')}
                value={this.state.imageUrl}
              />
            </div>
            <div className={bem('row')}>
              <div className={bemify(bem('row'))('label')}>
                Subtitle
              </div>
              <input
                type="text"
                className={bemify(bem('row'))('input')}
                onChange={this.handleChange.bind(this, 'subtitle')}
                value={this.state.subtitle}
              />
            </div>
            <div className={bem('row')}>
              <div className={bemify(bem('row'))('label')}>
                Description
              </div>
              <textarea
                className={bemify(bem('row'))('textarea')}
                onChange={this.handleChange.bind(this, 'description')}
                value={this.state.description}
              />
            </div>
            <div className={bem('row')}>
              <div className={bemify(bem('row'))('label')}>
                Data
              </div>
              <textarea
                className={bemify(bem('row'))('textarea')}
                onChange={this.handleChange.bind(this, 'data')}
                value={this.state.data}
              />
            </div>
            <div className={bem('row')}>
              <div className={bemify(bem('row'))('label')}>
                Evaluation
              </div>
              <textarea
                className={bemify(bem('row'))('textarea')}
                onChange={this.handleChange.bind(this, 'evaluation')}
                value={this.state.evaluation}
              />
            </div>
            <div className={bem('row')}>
              <div className={bemify(bem('row'))('label')}>
                Rules
              </div>
              <textarea
                className={bemify(bem('row'))('textarea')}
                onChange={this.handleChange.bind(this, 'rules')}
                value={this.state.rules}
              />
            </div>
          </div>
          <div className={bem('footer')}>
            <button
              className={bemify(bem('footer'))('button')}
              onClick={this.submit}
            >
              Update
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect(
  (state, { address }) => ({
    bountyData: state.bounties.allBountiesMap[address],
  }),
  dispatch => ({
    updateBountyDetail: bounty => dispatch(actions.updateBountyDetail(bounty)),
  })
)(UpdateBountyDetailModal);
