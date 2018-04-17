import { createAction, handleActions } from 'redux-actions'
import { MARKETPLACE_CONTRACT_ADDRESS, MARKETPLACE_CONTRACT_ABI } from '../utils/constants';

const API_ADDRESS = '/algorithmns';
// const API_ADDRESS = 'https://cors-anywhere.herokuapp.com/http://104.198.104.19:8881/algorithmns'
const GET_PURCHASED_STATE_REQUEST = 'app/algorithmns/getPurchasedStateRequest';
const GET_PURCHASED_STATE_RESPONSE = 'app/algorithmns/getPurchasedStateResponse';
const BUY_ALGO_REQUEST = 'app/algorithmns/buyAlgoRequest';
const BUY_ALGO_RESPONSE = 'app/algorithmns/buyAlgoResponse';
const FETCH_ALL_ALGOS_REQUEST = 'app/algorithmns/fetchAllAlgosRequest';
const FETCH_ALL_ALGOS_RESPONSE = 'app/algorithmns/fetchAllAlgosResponse';

const initialState = {
  order: [],
  map: {},
  purchased: {},
  isRequestingPurchasedState: false,
  isBuyingAlgo: false,
  isFetchingAlgos: false,
};

export const getPurchasedStateRequest = createAction(GET_PURCHASED_STATE_REQUEST);
export const getPurchasedStateResponse = createAction(GET_PURCHASED_STATE_RESPONSE);
export const getPurchasedState = algoId => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(getPurchasedStateRequest());

  const [account] = accounts;
  const contract = window.web3.eth.contract(MARKETPLACE_CONTRACT_ABI).at(MARKETPLACE_CONTRACT_ADDRESS);

  contract.betaAccess(account, (err, data) => {
    if (err) {
      return dispatch(getPurchasedStateResponse(err));
    }

    return dispatch(getPurchasedStateResponse({
      id: algoId,
      isPurchased: data,
    }));
  });
}

export const buyAlgoRequest = createAction(BUY_ALGO_REQUEST);
export const buyAlgoResponse = createAction(BUY_ALGO_RESPONSE);
export const buyAlgo = algoId => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(buyAlgoRequest());

  const contract = window.web3.eth.contract(MARKETPLACE_CONTRACT_ABI).at(MARKETPLACE_CONTRACT_ADDRESS);

  contract.buyBeta(1000000000000000000, { from: accounts[0] }, (err, resp) => {
    if (err) {
      return dispatch(buyAlgoRequest(err));
    }

    return dispatch(buyAlgoResponse({ txHash: resp, id: algoId }));
  });

}

export const fetchAllAlgosRequest = createAction(FETCH_ALL_ALGOS_REQUEST);
export const fetchAllAlgosResponse = createAction(FETCH_ALL_ALGOS_RESPONSE);
export const fetchAllAlgos = () => async dispatch => {
  dispatch(fetchAllAlgosRequest());

  try {
    const response = await fetch(API_ADDRESS);
    const { algos } = await response.json();
    return dispatch(fetchAllAlgosResponse(algos));
  } catch (err) {
    return dispatch(fetchAllAlgosResponse(err));
  }
}

export default handleActions({

  [GET_PURCHASED_STATE_REQUEST]: state => ({
    ...state,
    isRequestingPurchasedState: true,
  }),

  [GET_PURCHASED_STATE_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isRequestingPurchasedState: false,
    purchased: error
      ? state.purchased
      : {
        ...state.purchased,
        [payload.id]: payload.isPurchased,
      },
  }),

  [BUY_ALGO_REQUEST]: state => ({
    ...state,
    isBuyingAlgo: true,
  }),

  [BUY_ALGO_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isBuyingAlgo: false,
    purchased: error
      ? state.purchased
      : {
        ...state.purchased,
        [payload.id]: payload.txHash,
      },
  }),

  [FETCH_ALL_ALGOS_REQUEST]: state => ({
    ...state,
    isFetchingAlgos: true,
  }),

  [FETCH_ALL_ALGOS_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isFetchingAlgos: false,
    order: error
      ? state.order
      : payload.map(({ algo_id }) => algo_id),
    map: error
      ? state.map
      : payload.reduce((map, algo) => ({
        ...map,
        [algo.algo_id]: algo,
      }), {}),
  })

}, initialState);
