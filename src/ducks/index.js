import { combineReducers } from 'redux';
import metamask from './metamask';
import algorithmns from './algorithmns';
import bounties from './bounties';
import jobs from './jobs';

export default combineReducers({
  metamask,
  algorithmns,
  bounties,
  jobs,
});
