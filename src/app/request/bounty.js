import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
// import classnames from 'classnames';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import * as actions from '../../ducks/bounties';
import BountySidebar from './bounty-sidebar';
import BountyPrizes from './bounty-prizes';
import BountyAdmin from './bounty-admin';
import BountyHeader from './bounty-header';
import Submission from './submission';

import './bounty.css';

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

  renderMarkdown(source) {
    return (
      <Markdown
        className="bounty-page__markdown"
        source={source}
      />
    );
  }

  render() {
    const { match, bountyData } = this.props;
    const { address } = match.params;
    const data = bountyData || {
      prizes: [],
      participants: [],
    };

    return (
      <div className="bounty-page">
        <BountyHeader address={address} />
        <div className="bounty-page__body">
          <Switch>
            <BountySidebar address={address} />
          </Switch>
          <div className="bounty-page__content">
            <Switch>
              <Route path="/bounties/:address/description" render={() => this.renderMarkdown(data.description)} />
              <Route path="/bounties/:address/prizes" component={BountyPrizes} />
              <Route path="/bounties/:address/evaluation" render={() => this.renderMarkdown(data.evaluation)} />
              <Route path="/bounties/:address/data" render={() => this.renderMarkdown(data.data)} />
              <Route path="/bounties/:address/rules" render={() => this.renderMarkdown(data.rules)} />
              <Route path="/bounties/:address/submission" component={Submission} />
              <Route path="/bounties/:address/admin" component={BountyAdmin} />
              <Route render={() => this.renderMarkdown(data.description)} />
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
    isCreatedByMe: state.bounties.createdByMe.indexOf(match.params.address) > -1,
  }),
  (dispatch, { match }) => ({
    getBounty: () => dispatch(actions.getBounty(match.params.address)),
  })
)(withRouter(Bounty));
