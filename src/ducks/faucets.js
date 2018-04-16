import { createAction, handleActions } from 'redux-actions';
import { TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI } from '../utils/constants';

// Constant
const FAUCET_API = 'https://cors-anywhere.herokuapp.com/http://faucet.ropsten.be:3001/donate';
const GET_ETH_REQUEST = 'app/faucet/requestEthRequest';
const GET_ETH_RESPONSE = 'app/faucet/requestEthResponse';
const GET_DML_REQUEST = 'app/faucet/requestDmlRequest';
const GET_DML_RESPONSE = 'app/faucet/requestDmlResponse';

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

export const getDmlRequest = createAction(GET_DML_REQUEST);
export const getDmlResponse = createAction(GET_DML_RESPONSE);

export const requestDml = () => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(getDmlRequest());

  const [address] = accounts;
  const contract = window.web3.eth.contract(TOKEN_CONTRACT_ABI).at(TOKEN_CONTRACT_ADDRESS);

  contract.request(address, (error, resp) => {
    if (error) {
      return dispatch(getDmlResponse(error));
    }

    return dispatch(getDmlResponse(resp));
  });
}

// Reducer
const initialState = {
  isRequestingEther: false,
  isRequestingDml: false,
  hasRequestedDml: false,
  etherFaucetError: '',
  dmlFaucetError: '',
  dmlFaucetTx: '',
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

  [GET_DML_REQUEST]: state => ({
    ...state,
    isRequestingDml: true,
  }),

  [GET_DML_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isRequestingDml: false,
    hasRequestedDml: !error,
    dmlFaucetTx: error ? '' : payload,
    dmlFaucetError: error ? payload.message : '',
  }),

}, initialState);
