import { combineReducers } from 'redux';
import metamask from './metamask';
import algorithmns from './algorithmns';
import faucets from './faucets';

export default combineReducers({
  metamask,
  algorithmns,
  faucets,
});
