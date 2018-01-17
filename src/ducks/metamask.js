import { createAction, handleActions } from 'redux-actions'

// Constants
const DETECT = 'app/metamask/detect';

const initialState = {
  hasWeb3: false,
  accounts: [],
  isLocked: false,
};

export const detect = createAction(DETECT);

export const startPolling = () => dispatch => {

  if(typeof window.web3 === 'undefined') {
    dispatch(detect(false));
  } else {
    dispatch(detect(window.web3));
  }

  setTimeout(() => dispatch(startPolling()), 5000);
};

export default handleActions({

  [DETECT]: (state, { payload: web3 }) => ({
    ...state,
    hasWeb3: Boolean(web3),
    accounts: web3 ? web3.eth.accounts : [],
    isLocked: web3 ? web3.eth.accounts < 1 : false,
  }),

}, initialState);
