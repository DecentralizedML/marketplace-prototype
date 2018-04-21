import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// import classnames from 'classnames';
import PropTypes from 'prop-types';
// import * as actions from '../../ducks/bounties';

class BountyPrizes extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    bountyData: PropTypes.object,
  };

  render() {
    const { bountyData } = this.props;
    const data = bountyData || {
      prizes: [],
      participants: [],
    };

    return (
      <div className="bounty-page__prizes">
        {data.prizes.map((prize, i) => (
          <div key={i} className="bounty-page__prizes__row">
            <div className="bounty-page__prizes__place">{`#${i + 1}`}</div>
            <div className="bounty-page__prizes__prize">
              {`${prize.dividedBy(1000000000000000000).toNumber().toFixed(0)} DML`}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default connect(
  (state, { match }) => ({
    bountyData: state.bounties.allBountiesMap[match.params.address],
  })
)(withRouter(BountyPrizes));
