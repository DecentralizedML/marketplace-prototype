import { createAction, handleActions } from 'redux-actions'
import { TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI } from '../utils/constants';

// import socket from '../utils/io';

// Constants
const ETH_DECIMALS = 18;
const ETH_DENOMINATION = Math.pow(10, ETH_DECIMALS);
const DETECT = 'app/metamask/detect';
const UPDATE_ETH_BALANCE = 'app/metamask/updateEthBalance';
const UPDATE_DML_BALANCE = 'app/metamask/updateDmlBalance';

const initialState = {
  hasWeb3: false,
  accounts: [],
  isLocked: false,
  network: null,
  ethBalance: 0,
  dmlBalance: 0,
};

export const detect = createAction(DETECT);
export const updateEthBalance = createAction(UPDATE_ETH_BALANCE);
export const updateDmlBalance = createAction(UPDATE_DML_BALANCE);

// let hasConnectedToSocket = false;

export const startPolling = () => (dispatch, getState) => {
  const { metamask: { isLocked } } = getState();
  const timeout = isLocked ? 1000 : 5000;

  if(typeof window.web3 === 'undefined') {
    dispatch(detect(false));
  } else {
    const web3 = window.web3;
    const account = web3.eth.accounts[0] || '';

    dispatch(detect(web3));

    if (account) {
      web3.eth.getBalance(account, (err, data) => {
        if (err) {
          return dispatch(updateEthBalance(err));
        }

        return dispatch(updateEthBalance(data.toString() / ETH_DENOMINATION));
      });

      const contract = window.web3.eth.contract(TOKEN_CONTRACT_ABI).at(TOKEN_CONTRACT_ADDRESS);
      contract.balanceOf(account, (err, data) => {
        if (err) {
          return dispatch(updateDmlBalance(err));
        }

        return dispatch(updateDmlBalance(web3.fromWei(data, 'ether').toNumber()));
      })
    }

  }

  setTimeout(() => dispatch(startPolling()), timeout);
};

export default handleActions({

  [DETECT]: (state, { payload: web3 }) => ({
    ...state,
    hasWeb3: Boolean(web3),
    accounts: web3 ? web3.eth.accounts : [],
    isLocked: web3 ? web3.eth.accounts < 1 : false,
    network: web3 ? web3.version.network : null,
  }),

  [UPDATE_ETH_BALANCE]: (state, { payload, error }) => ({
    ...state,
    ethBalance: error ? 0 : payload,
  }),

  [UPDATE_DML_BALANCE]: (state, { payload, error }) => ({
    ...state,
    dmlBalance: error ? 0 : payload,
  }),

}, initialState);
