import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
// import * as actions from '../../ducks/bounties';

const TABS = [
  { name: 'Prizes', path: "prizes" },
  { name: 'Description', path: "description" },
  { name: 'Data', path: "data" },
  { name: 'Evaluation', path: "evaluation" },
  { name: 'Rules', path: "rules" },
  { name: 'Submission', path: "submission" },
  { name: 'Winners', path: "winners" },
  { name: 'Admin', path: "admin" },
];

class BountySiderbar extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    bountyData: PropTypes.object,
    isCreatedByMe: PropTypes.bool.isRequired,
    account: PropTypes.string,
  };

  render() {
    const { address, history, location, isCreatedByMe } = this.props;

    return (
      <div className="bounty-page__sidebar">
        {
          TABS.map(({ name, path }) => {
            if (path === 'admin' && !isCreatedByMe) {
              return null;
            }

            return (
              <div
                key={path}
                className={classnames('bounty-page__sidebar__item', {
                  'bounty-page__sidebar__item--active': location.pathname === `/bounties/${address}/${path}`,
                  'bounty-page__sidebar__item--admin': path === 'admin',
                })}
                onClick={() => history.push(`/bounties/${address}/${path}`)}
              >
                {name}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default connect(
  (state, { address }) => ({
    bountyData: state.bounties.allBountiesMap[address],
    isCreatedByMe: state.bounties.createdByMe.indexOf(address) > -1,
    account: state.metamask.accounts[0],
  }),
)(withRouter(BountySiderbar));
