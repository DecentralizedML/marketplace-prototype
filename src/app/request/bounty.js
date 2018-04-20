import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as actions from '../../ducks/bounties';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';

import './bounty.css';

const TABS = [
  { name: 'Description', path: "description" },
  { name: 'Prizes', path: "prizes" },
  { name: 'Evaluation', path: "evaluation" },
  { name: 'Data', path: "data" },
  { name: 'Rules', path: "rules" },
  { name: 'Submission', path: "submission" },
  { name: 'Admin', path: "admin" },
];

class Bounty extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    // Redux
    getBounty: PropTypes.func.isRequired,
    bountyData: PropTypes.object,
  };

  componentWillMount() {
    this.props.getBounty();
  }

  renderStatus(status) {
    return (
      <div className={`bounty-page__status bounty-page__status--${getStatus(status)}`}>
        {getText(status)}
      </div>
    );

    function getText(st) {
      let value;

      if (typeof st === 'number') {
        value = st;
      } else if (st && st.toNumber) {
        value = st.toNumber();
      }

      switch (value) {
        case 0:
          return 'Not Ready for Enrollment';
        default:
          return '';
      }
    }

    function getStatus(st) {
      let value;

      if (typeof st === 'number') {
        value = st;
      } else if (st && st.toNumber) {
        value = st.toNumber();
      }

      switch (value) {
        case 0:
          return 'initialized';
        default:
          return '';
      }
    }
  }

  renderPrizes = () => {
    const { bountyData } = this.props;
    const data = bountyData || {
      prizes: [],
      participants: [],
    };

    return (
      <div className="bounty-page__prizes">
        {data.prizes.map((prize, i) => (
          <div className="bounty-page__prizes__row">
            <div className="bounty-page__prizes__place">{`#${i + 1}`}</div>
            <div className="bounty-page__prizes__prize">
              {`${prize.dividedBy(1000000000000000000).toNumber().toFixed(0)} DML`}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { match, history, location, bountyData } = this.props;
    const { address } = match.params;
    const data = bountyData || {
      prizes: [],
      participants: [],
    };

    return (
      <div className="bounty-page">
        <div className="bounty-page__header">
          <div className="bounty-page__primary-data">
            <div className="bounty-page__general-info">
              <div className="bounty-page__title">
                {data.title}
              </div>
              <div className="bounty-page__subtitle">
                {data.subtitle}
              </div>
            </div>
            <div className="bounty-page__prize-info">
              <div className="bounty-page__prize">
                {`${data.prizes.reduce((sum, prize) => sum + prize.toNumber()/1000000000000000000, 0).toFixed(0)} DML`}
              </div>
              <div className="bounty-page__prize-text">
                Total Prize
              </div>
            </div>
          </div>
          <div className="bounty-page__secondary-data">
            { this.renderStatus(data.status) }
            <div className="bounty-page__secondary-data__divider" />
            <div className="bounty-page__participants">
              {`${data.participants.length} participants`}
            </div>
          </div>
        </div>
        <div className="bounty-page__body">
          <div className="bounty-page__sidebar">
            {TABS.map(({ name, path }) => (
              <div
                key={path}
                className={classnames('bounty-page__sidebar__item', {
                  'bounty-page__sidebar__item--active': location.pathname === `/bounties/${address}/${path}`,
                })}
                onClick={() => history.push(`/bounties/${address}/${path}`)}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="bounty-page__content">
            <Switch>
              <Route path="/bounties/:address/description" render={() => <div>I am a description</div>} />
              <Route path="/bounties/:address/prizes" render={this.renderPrizes} />
              <Route path="/bounties/:address/evaluation" render={() => <div>I am a evaluation</div>} />
              <Route path="/bounties/:address/data" render={() => <div>I am a data</div>} />
              <Route path="/bounties/:address/rules" render={() => <div>I am a rules</div>} />
              <Route path="/bounties/:address/submission" render={() => <div>I am a submission</div>} />
              <Route path="/bounties/:address/admin" render={() => <div>I am a admin</div>} />
              <Route render={() => <div>I am a description</div>} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state, { match }) => ({
    bountyData: state.bounties.allBountiesMap[match.params.address],
  }),
  (dispatch, { match }) => ({
    getBounty: () => dispatch(actions.getBounty(match.params.address)),
  })
)(withRouter(Bounty));
