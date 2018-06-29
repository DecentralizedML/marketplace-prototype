import { combineReducers } from 'redux';
import metamask from './metamask';
import algorithms from './algorithms';
import bounties from './bounties';
import jobs from './jobs';
import user from './user';

export default combineReducers({
  metamask,
  algorithms,
  bounties,
  jobs,
  user,
});
