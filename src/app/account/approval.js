import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../ducks/metamask';

class Approval extends Component {
  static propTypes = {
    dmlAllowance: PropTypes.string.isRequired,
    isApprovingDml: PropTypes.bool.isRequired,
    approveDml: PropTypes.func.isRequired,
  };

  state = {
    approvalLimit: '',
  };

  approve = async () => {
    const { approveDml } = this.props;
    const { approvalLimit } = this.state;

    if (!approvalLimit) {
      return null;
    }

    try {
      await approveDml(approvalLimit);
    } finally {
      this.setState({ approvalLimit: '' });
    }
  }

  render() {
    const { approvalLimit } = this.state;
    const { dmlAllowance, isApprovingDml } = this.props;

    return (
      <div className="wallet-card">
        <div className="wallet-card__header">
          <div className="wallet-card__title">Approved Debit Limit</div>
        </div>
        <div className="wallet-card__content">
          <div className="wallet-card__warining-message">
            In order to make purchases using DML, you will first need to give us approval to debit your DML balance.
          </div>
          <div className="wallet-card__balances">
            <div className="wallet-card__balance-row">
              <div className="wallet-card__balance">
                <div className="wallet-card__balance-header-text">Current Debit Limit:</div>
                <div className="wallet-card__balance-wrapper">
                  <span className="wallet-card__balance-text">{dmlAllowance}</span>
                  <span className="wallet-card__balance-unit wallet-card__balance-unit--dml">DML</span>
                </div>
              </div>
            </div>
            <div className="wallet-card__balance-row">
              <div className="wallet-card__balance">
                <div className="wallet-card__balance-header-text">Set New Debit Limit:</div>
                <div className="wallet-card__balance-wrapper">
                  <input
                    className="wallet-card__input"
                    type="number"
                    placeholder="100"
                    onChange={e => this.setState({ approvalLimit: Number(e.target.value) })}
                    value={approvalLimit}
                  />
                </div>
                <button
                  className="wallet-card__approve-btn"
                  disabled={!approvalLimit || isApprovingDml}
                  onClick={this.approve}
                >
                  { 
                    isApprovingDml
                      ? 'Setting Debit Limit...'
                      : `Set Debit Limit to ${approvalLimit ? approvalLimit : 0} DML`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    dmlAllowance: state.metamask.dmlAllowance.toFixed(0),
    isApprovingDml: state.metamask.isApprovingDml,
  }),
  dispatch => ({
    approveDml: allowance => dispatch(actions.approveDml(allowance)),
  }),
)(Approval);
