import { combineReducers } from 'redux';
import metamask from './metamask';
import algorithmns from './algorithmns';
import faucets from './faucets';
import jobs from './jobs';

export default combineReducers({
  metamask,
  algorithmns,
  faucets,
  jobs,
});
