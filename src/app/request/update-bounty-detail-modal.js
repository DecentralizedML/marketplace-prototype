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
    isUpdatingBounty: PropTypes.bool.isRequired,
    account: PropTypes.string.isRequired,
    jwt: PropTypes.string.isRequired,
  };

  state = {
    error: '',
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

    const { address, updateBountyDetail, onClose, account } = this.props;

    if (!thumbnailUrl || !imageUrl || !subtitle || !description || !data || !evaluation || !rules || !address || !account) {
      this.setState({ error: 'All fields are required'});
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
      account,
    }).then(d => {
      if (d.error) {
        this.setState({ error: d.error });
        return;
      }

      onClose();

    }).catch(e => this.setState({ error: e.message }));
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
            <div className={bem('error')}>{this.state.error}</div>
            <button
              className={bemify(bem('footer'))('button')}
              onClick={this.submit}
              disabled={this.props.isUpdatingBounty}
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
    isUpdatingBounty: state.bounties.isUpdatingBounty,
    account: state.metamask.accounts[0],
    jwt: state.user.jwt,
  }),
  dispatch => ({
    updateBountyDetail: bounty => dispatch(actions.updateBountyDetail(bounty)),
  })
)(UpdateBountyDetailModal);
