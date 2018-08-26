import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/bounties';
import { BOUNTY_ABI } from '../../utils/constants';
import Modal from '../components/modal';

const bemify = block => (elem = '', modifier = '') => (
  `${block}${elem && '__' + elem}${modifier && '--' + modifier}`
);

const bem = bemify('bounty-page__admin__update-bounty-detail-modal');

class UpdateWinnersModal extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onTxSubmit: PropTypes.func.isRequired,
    bountyData: PropTypes.object,
    isLocked: PropTypes.bool.isRequired,
    hasWeb3: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    bountyData: {
      prizes: [],
      participants: [],
    },
  };

  state = {
    winners: ['', '', '', '', ''],
    error: '',
  };

  submit = () => {
    const { bountyData: { prizes, participants }, hasWeb3, isLocked, address } = this.props;

    if (!hasWeb3 || isLocked || this.state.updateWinnerTx) {
      return null;
    }

    const { winners } = this.state;
    const trimmed = winners.filter(d => !!d);
    let error = '';

    if (trimmed.length !== prizes.length) {
      error = 'Number of winners does not match number of prizes';
    }

    if (!trimmed.length) {
      error = 'Cannot be empty';
    }

    winners.reduce((last, winner) => {
      if (!last && winner) {
        error = 'Cannot skip winners';
      }

      return winner;
    }, '0x0');

    trimmed.forEach(winner => {
      if (participants.indexOf(winner) < 0) {
        error = 'Winner must be a participant';
      }
    });

    this.setState({ error });

    if (!error) {
      const bounty = window.web3.eth.contract(BOUNTY_ABI).at(address);
      bounty.updateWinners(trimmed, (e, data) => {
        if (e) {
          if ((/User denied transaction/gi).test(e.message)) {
            this.setState({ error: 'MetaMask - User denied transaction' });
          } else {
            this.setState({ error: e.message });
          }
          return;
        }

        this.props.onTxSubmit(data);
        this.props.onClose();
      })
    }
  }

  renderInput(index) {
    const { winners } = this.state;

    return (
      <div className={bem('row')}>
        <div className={bemify(bem('row'))('label')}>
          {`Winner #${index + 1}`}
        </div>
        <input
          type="text"
          className={bemify(bem('row'))('input')}
          onChange={e => this.setState({
            winners: winners.map((winner, i) => i === index ? e.target.value : winner),
          })}
          value={winners[index]}
        />
      </div>
    );
  }

  render() {
    return (
      <Modal onClose={this.props.onClose}>
        <div className={classnames(bem(), bem('', 'update-winners'))} onClick={e => e.stopPropagation()}>
          <div className={bem('header')}>
            Update Winners
          </div>
          <div className={bem('content')}>
            {this.state.winners.map((winner, i) => this.renderInput(i))}
          </div>
          <div className={bem('footer')}>
            <div className={bem('error')}>{this.state.error}</div>
            <button
              className={bemify(bem('footer'))('button')}
              onClick={this.submit}
              disabled={this.state.updateWinnerTx}
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
    isLocked: state.metamask.isLocked,
    hasWeb3: state.metamask.hasWeb3,
  }),
  dispatch => ({
    updateBountyDetail: bounty => dispatch(actions.updateBountyDetail(bounty)),
  })
)(UpdateWinnersModal);
