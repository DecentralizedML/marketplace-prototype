import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/bounties';

class BountyRow extends Component {
  static propTypes = {
    // Own Props -- passed from request/index.js
    address: PropTypes.string.isRequired,

    // Redux
    getBounty: PropTypes.func.isRequired,
    bountyData: PropTypes.object,
  };

  componentWillMount() {
    this.props.getBounty();
  }

  render() {
    const data = this.props.bountyData || {
      prizes: [],
      participants: [],
    };

    return (
      <div
        className={classnames('bounty__bounty-row', {
          'bounty__bounty-row--loading': !this.props.bountyData,
        })}
      >
        <div
          className="bounty__bounty-row__thumbnail"
          style={{
            backgroundImage: `url(${data.thumbnailUrl})`,
          }}
        />
        <div className="bounty__bounty-row__body">
          <div className="bounty__bounty-row__title">
            {data.title}
          </div>
          <div className="bounty__bounty-row__description">
            {data.subtitle}
          </div>
        </div>
        <div className="bounty__bounty-row__footer">
          <div className="bounty__bounty-row__prize">
            {`${data.prizes.reduce((sum, prize) => sum + prize.toNumber()/1000000000000000000, 0)} DML`}
          </div>
          <div className="bounty__bounty-row__participants">
            {`${data.participants.length} participants`}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state, { address }) => ({
    bountyData: state.bounties.allBountiesMap[address],
  }),
  (dispatch, ownProps) => ({
    getBounty: () => dispatch(actions.getBounty(ownProps.address)),
  })
)(BountyRow);
