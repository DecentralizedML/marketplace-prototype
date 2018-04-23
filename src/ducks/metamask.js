import { createAction, handleActions } from 'redux-actions'
import { TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, MARKETPLACE_CONTRACT_ADDRESS } from '../utils/constants';
import { logout } from './user';

// Constants
const DETECT = 'app/metamask/detect';
const UPDATE_ETH_BALANCE = 'app/metamask/updateEthBalance';
const UPDATE_DML_BALANCE = 'app/metamask/updateDmlBalance';
const UPDATE_DML_ALLOWANCE = 'app/metamask/updateDmlAllowance';
const DML_APPROVE_REQUEST = 'app/metamask/dmlApproveRequest';
const DML_APPROVE_RESPONSE = 'app/metamask/dmlApproveResponse';

const initialState = {
  hasWeb3: false,
  accounts: [],
  isLocked: false,
  isApprovingDml: false,
  network: null,
  ethBalance: 0,
  dmlBalance: 0,
  dmlAllowance: 0,
};

export const detect = createAction(DETECT);
export const updateEthBalance = createAction(UPDATE_ETH_BALANCE);
export const updateDmlBalance = createAction(UPDATE_DML_BALANCE);
export const updateDmlAllowance = createAction(UPDATE_DML_ALLOWANCE);
export const dmlApproveRequest = createAction(DML_APPROVE_REQUEST);
export const dmlApproveResponse = createAction(DML_APPROVE_RESPONSE);


export const startPolling = () => async (dispatch, getState) => {
  const { metamask: { isLocked, accounts } } = getState();
  const timeout = isLocked ? 1000 : 5000;

  if(typeof window.web3 === 'undefined') {
    dispatch(detect(false));
  } else {
    const web3 = window.web3;
    const account = web3.eth.accounts[0] || '';


    if (typeof accounts[0] !== 'undefined' && accounts[0] !== account) {
      dispatch(logout());
    }

    dispatch(detect(web3));

    if (account) {
      web3.eth.getBalance(account, (err, data) => {
        if (err) {
          return dispatch(updateEthBalance(err));
        }

        return dispatch(updateEthBalance(web3.fromWei(data, 'ether').toNumber()));
      });

      const contract = window.web3.eth.contract(TOKEN_CONTRACT_ABI).at(TOKEN_CONTRACT_ADDRESS);
      let denominator;

      try {
        const decimals = await getDecimals(contract);
        denominator = Math.pow(10, decimals);
      } catch (err) {
        console.error('Error getting decimals');
        console.error(err)
      }

      if (denominator) {
        try {
          const dmlBalance = await getDmlBalance(contract, account);
          dispatch(updateDmlBalance(dmlBalance/denominator));
        } catch (e) {
          dispatch(updateDmlBalance(e));
        }

        try {
          const dmlAllowance = await getDmlAllowance(contract, account);
          dispatch(updateDmlAllowance(dmlAllowance/denominator));
        } catch (err) {
          dispatch(updateDmlAllowance(err));
        }
      }

    }

  }

  setTimeout(() => dispatch(startPolling()), timeout);
};

function getDecimals(contract) {
  return new Promise((resolve, reject) => {
    contract.decimals((err, data) => {
      if (err) {
        return reject(err);
      }
      
      resolve(data.toNumber());
    })
  });
}

function getDmlBalance(contract, account) {
  return new Promise((resolve, reject) => {
    contract.balanceOf(account, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.toNumber())
    });
  });
}

function getDmlAllowance(contract, account) {
  return new Promise((resolve, reject) => {
    contract.allowance(account, MARKETPLACE_CONTRACT_ADDRESS, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.toNumber())
    });
  });
}

export const approveDml = allowance => (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3 } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(dmlApproveRequest()); 
  const contract = window.web3.eth.contract(TOKEN_CONTRACT_ABI).at(TOKEN_CONTRACT_ADDRESS);

  return new Promise(async (resolve, reject) => {
    const decimals = await getDecimals(contract);
    const denominator = Math.pow(10, decimals);

    contract.approve(MARKETPLACE_CONTRACT_ADDRESS, allowance * denominator, (err, data) => {
      if (err) {
        dispatch(dmlApproveResponse(err));
        return reject(err);
      }

      dispatch(dmlApproveResponse(data));
      return resolve(data);
    }) 
  });
}

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

  [UPDATE_DML_ALLOWANCE]: (state, { payload, error }) => ({
    ...state,
    dmlAllowance: error ? 0 : payload,
  }),

  [DML_APPROVE_REQUEST]: state => ({
    ...state,
    isApprovingDml: true,
  }),

  [DML_APPROVE_RESPONSE]: state => ({
    ...state,
    isApprovingDml: false,
  })

}, initialState);
