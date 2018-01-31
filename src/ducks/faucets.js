import { createAction, handleActions } from 'redux-actions'

// Constant
const FAUCET_API = 'http://faucet.ropsten.be:3001/donate';
export const TOKEN_ADDRESS = '0x2EfC97b48c745488d3CCbaC2aEc87D14eeE5d4fF';
export const TOKEN_ABI = [{"constant":false,"inputs":[{"name":"amounts","type":"uint256[]"}],"name":"sum","outputs":[{"name":"totalAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[]"},{"name":"amounts","type":"uint256[]"}],"name":"mintMultiples","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"request","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[]"},{"name":"amounts","type":"uint256[]"}],"name":"transferMulitples","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];

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
  const contract = window.web3.eth.contract(TOKEN_ABI).at(TOKEN_ADDRESS);

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
