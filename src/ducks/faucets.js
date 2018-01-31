import { createAction, handleActions } from 'redux-actions'

// Constant
const FAUCET_API = 'http://faucet.ropsten.be:3001/donate';
const GET_ETH_REQUEST = 'app/faucet/requestEthRequest';
const GET_ETH_RESPONSE = 'app/faucet/requestEthResponse';

// Actions
export const getEtherRequest = createAction(GET_ETH_REQUEST);
export const getEtherResponse = createAction(GET_ETH_RESPONSE);

export const requestEther = () => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  const [address] = accounts;

  dispatch(getEtherRequest());

  try {
    const resp = await fetch(`${FAUCET_API}/${address}`);
    const { amount, message } = await resp.json();
    
    if (amount) {
      dispatch(getEtherResponse());
    } else if (message) {
      dispatch(getEtherResponse(new Error(message)));
    }
  } catch (e) {
    dispatch(getEtherResponse(e));
  }

}

// Reducer
const initialState = {
  isRequestingEther: false,
  etherFaucetError: '',
};

export default handleActions({

  [GET_ETH_REQUEST]: state => ({
    ...state,
    isRequestingEther: true,
  }),

  [GET_ETH_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isRequestingEther: false,
    etherFaucetError: error ? payload.message : '',
  }),

}, initialState);
