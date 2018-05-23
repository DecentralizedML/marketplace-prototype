import { createAction, handleActions } from 'redux-actions'
import {
  MARKETPLACE_CONTRACT_ADDRESS,
  MARKETPLACE_CONTRACT_ABI,
  ALGO_ABI,
} from '../utils/constants';
import asyncQueue from '../utils/async-queue';

const API_ADDRESS = process.env.NODE_ENV === 'development'
  ? '/algorithmns'
  : 'https://cors-anywhere.herokuapp.com/http://104.198.104.19:8881/algorithmns';

const GET_PURCHASED_STATE_REQUEST = 'app/algorithmns/getPurchasedStateRequest';
const GET_PURCHASED_STATE_RESPONSE = 'app/algorithmns/getPurchasedStateResponse';

const BUY_ALGO_REQUEST = 'app/algorithmns/buyAlgoRequest';
const BUY_ALGO_RESPONSE = 'app/algorithmns/buyAlgoResponse';

const FETCH_ALL_ALGOS_REQUEST = 'app/algorithmns/fetchAllAlgosRequest';
const FETCH_ALL_ALGOS_RESPONSE = 'app/algorithmns/fetchAllAlgosResponse';

const FETCH_MY_ALGOS_REQUEST = 'app/algorithmns/fetchMyAlgosRequest';
const FETCH_MY_ALGOS_RESPONSE = 'app/algorithmns/fetchMyAlgosResponse';

const CREATE_ALGO_REQUEST = 'app/algorithmns/createAlgoRequest';
const CREATE_ALGO_RESPONSE = 'app/algorithmns/createAlgoResponse';

const GET_ALGO_DATA_REQUEST = 'app/algorithmns/getAlgoDataRequest';
const GET_ALGO_DATA_RESPONSE = 'app/algorithmns/getAlgoDataResponse';

const UPDATE_ALGO_REQUEST = 'app/algorithmns/updateAlgoRequest';
const UPDATE_ALGO_RESPONSE = 'app/algorithmns/updateAlgoResponse';

const ALGO_STATUS = [
  'Inactive',
  'Active',
];

const initialState = {
  myAlgos: [],
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

  contract.hasPurchased(account, algoId, (err, data) => {
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

  contract.buy(algoId, 1000000000000000000, { from: accounts[0] }, (err, resp) => {
    if (err) {
      return dispatch(buyAlgoRequest(err));
    }

    return dispatch(buyAlgoResponse({ txHash: resp, id: algoId }));
  });

}

export const fetchAllAlgosRequest = createAction(FETCH_ALL_ALGOS_REQUEST);
export const fetchAllAlgosResponse = createAction(FETCH_ALL_ALGOS_RESPONSE);
export const fetchAllAlgos = () => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(fetchAllAlgosRequest());

  const contract = window.web3.eth.contract(MARKETPLACE_CONTRACT_ABI).at(MARKETPLACE_CONTRACT_ADDRESS);
  contract.getAllAlgos((err, resp) => {
    console.log(resp)
  })

  try {
    const response = await fetch(API_ADDRESS);
    const { algos } = await response.json();
    return dispatch(fetchAllAlgosResponse(algos));
  } catch (err) {
    return dispatch(fetchAllAlgosResponse(err));
  }
}

export const fetchMyAlgosRequest = createAction(FETCH_MY_ALGOS_REQUEST);
export const fetchMyAlgosResponse = createAction(FETCH_MY_ALGOS_RESPONSE);
export const fetchMyAlgos = () => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(fetchMyAlgosRequest());

  const contract = window.web3.eth.contract(MARKETPLACE_CONTRACT_ABI).at(MARKETPLACE_CONTRACT_ADDRESS);
  contract.getAlgosByCreator(accounts[0], (err, resp) => {
    if (err) {
      return dispatch(fetchMyAlgosResponse(err));
    }

    return dispatch(fetchMyAlgosResponse(resp));
  });
};


export const createAlgoRequest = createAction(CREATE_ALGO_REQUEST);
export const createAlgoResponse = createAction(CREATE_ALGO_RESPONSE);
export const createAlgo = price => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3 } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(createAlgoRequest());

  const contract = window.web3.eth.contract(MARKETPLACE_CONTRACT_ABI).at(MARKETPLACE_CONTRACT_ADDRESS);

  return new Promise((resolve, reject) => {
    contract.addAlgo(price * 1000000000000000000, (err, resp) => {
      if (err) {
        dispatch(createAlgoResponse(err));
        return reject(err);
      }

      dispatch(createAlgoResponse(resp));
      return resolve(resp);
    });
  })
};

export const getAlgoDataRequest = createAction(GET_ALGO_DATA_REQUEST);
export const getAlgoDataResponse = createAction(GET_ALGO_DATA_RESPONSE);
export const getAlgoData = address => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3 } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(getAlgoDataRequest());

  const contract = window.web3.eth.contract(ALGO_ABI).at(address);

  asyncQueue.add(async () => {
    try {
      const contractData = await promisify(contract.getData);
      dispatch(getAlgoDataResponse({
        cost: contractData[0].toNumber(),
        isActive: contractData[1].toNumber() === 1,
        address,
      }));
    } catch (e) {
      dispatch(getAlgoDataResponse(e));
    }
  });
};

export const updateAlgoRequest = createAction(UPDATE_ALGO_REQUEST);
export const updateAlgoResponse = createAction(UPDATE_ALGO_RESPONSE);
export const updateAlgo = d => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(updateAlgoRequest);

  const data = new FormData();

  data.append('file', d.file);
  data.append('title', d.title);
  data.append('description', d.description);
  data.append('type', d.type);
  data.append('outputProcessing', d.outputProcessing);
  data.append('account', accounts[0]);
  data.append('address', d.address);

  const opts = {
    method: 'POST',
    body: data,
    headers: {
      Authorization: `${localStorage.getItem('jwt')}`,
    },
  };

  try {
    const res = await fetch(`${API_ADDRESS}/${d.address}`, opts);
    const json = await res.json();

    if (json.error) {
      return dispatch(updateAlgoResponse(new Error(json.payload)));
    }

    dispatch(updateAlgoResponse({ address: data.address, data: json.payload }));
  } catch (e) {
    dispatch(updateAlgoResponse(e));
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
  }),

  [FETCH_MY_ALGOS_REQUEST]: state => ({
    ...state,
    isFetchingAlgos: true,
  }),

  [FETCH_MY_ALGOS_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isFetchingAlgos: false,
    myAlgos: error
      ? []
      : payload || [],
  }),

  [GET_ALGO_DATA_RESPONSE]: (state, { payload, error }) => {
    if (error) {
      return state;
    }

    return {
      ...state,
      map: {
        ...state.map,
        [payload.address]: payload,
      },
    };
  }

}, initialState);

function promisify(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    })
  })
}
