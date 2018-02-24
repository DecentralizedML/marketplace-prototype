import { createAction, handleActions } from 'redux-actions'

// constant
const STATE_API = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "remaining",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "supply",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "minter",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "mainState",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "addresses",
        "type": "address[]"
      },
      {
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "transferMulitples",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "receiver",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "sum",
    "outputs": [
      {
        "name": "totalAmount",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "algoId",
        "type": "bytes32"
      }
    ],
    "name": "buyAlgo",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "request",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "addresses",
        "type": "address[]"
      },
      {
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "mintMultiples",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
// const STATE_CONTRACT = '0x80eAc850A1D6A4Bb75cFDdF834ad6ECC327c7AD8';
const STATE_CONTRACT = '0x8962fa8a49C253c0290c834f7c9b0ef5BC02630c';

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
  const contract = window.web3.eth.contract(STATE_API).at(STATE_CONTRACT);
  contract.mainState(account, algoId, (err, resp) => {
    if (err) {
      return dispatch(getPurchasedStateResponse(err));
    }
    return dispatch(getPurchasedStateResponse({
      id: algoId,
      isPurchased: resp,
    }));
  });
}

export const buyAlgoRequest = createAction(BUY_ALGO_REQUEST);
export const buyAlgoResponse = createAction(BUY_ALGO_RESPONSE);
export const buyAlgo = algoId => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3 } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(buyAlgoRequest());
  const contract = window.web3.eth.contract(STATE_API).at(STATE_CONTRACT);
  contract.buyAlgo(algoId, (err, resp) => {
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
    const response = await fetch('/algorithmns');
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
