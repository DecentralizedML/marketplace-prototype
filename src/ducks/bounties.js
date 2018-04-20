import { createAction, handleActions } from 'redux-actions'
import {
  BOUNTY_FACTORY_ADDRESS,
  BOUNTY_FACTORY_ABI,
  BOUNTY_ABI,
} from '../utils/constants';

const GET_ALL_BOUNTIES_REQUEST = 'app/bounties/getAllBountiesRequest';
const GET_ALL_BOUNTIES_RESPONSE = 'app/bounties/getAllBountiesResponse';
const GET_BOUNTY_REQUEST = 'app/bounties/getBountyRequest';
const GET_BOUNTY_RESPONSE = 'app/bounties/getBountyResponse';

const initialState = {
  allBounties:[],
  allBountiesMap: {},
  isLoadingAllBounties: false,
};

function getFactoryContract(getState) {
  const { metamask: { isLocked, hasWeb3 } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  return window.web3.eth.contract(BOUNTY_FACTORY_ABI).at(BOUNTY_FACTORY_ADDRESS);
}

function getBountyContract(address, getState) {
  const { metamask: { isLocked, hasWeb3 } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  return window.web3.eth.contract(BOUNTY_ABI).at(address);
}

const getAllBountiesRequest = createAction(GET_ALL_BOUNTIES_REQUEST);
const getAllBountiesResponse = createAction(GET_ALL_BOUNTIES_RESPONSE);
export const getAllBounties = () => (dispatch, getState) => {
  const bountyFactory = getFactoryContract(getState);

  if (!bountyFactory) {
    return;
  }

  dispatch(getAllBountiesRequest());

  bountyFactory.getAllBounties((err, data) => {
    if (err) {
      return dispatch(getAllBountiesResponse(err));
    }

    return dispatch(getAllBountiesResponse(data));
  });
}

const getBountyRequest = createAction(GET_BOUNTY_REQUEST);
const getBountyResponse = createAction(GET_BOUNTY_RESPONSE);
export const getBounty = address => async (dispatch, getState) => {
  const bounty = getBountyContract(address, getState);

  if (!bounty) {
    return null;
  }

  dispatch(getBountyRequest());

  const data = await promisify(bounty.getData)

  dispatch(getBountyResponse({
    bountyAddress: address,
    prizes: data[0],
    winners: data[1],
    participants: data[2],
    status: data[3],
    thumbnailUrl: 'https://kaggle2.blob.core.windows.net/competitions/kaggle/8540/logos/thumb76_76.png?t=2018-02-13-18-59-39',
    title: 'TalkingData AdTracking Fraud Detection Challenge',
    subtitle: 'Can you detect fraudulent click traffic for mobile app ads?',
  }));
}

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

export default handleActions({

  [GET_ALL_BOUNTIES_REQUEST]: state => ({
    ...state,
    isLoadingAllBounties: true,
  }),

  [GET_ALL_BOUNTIES_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isLoadingAllBounties: false,
    allBounties: error
      ? state.allBounties
      : payload,
  }),

  [GET_BOUNTY_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    allBountiesMap: error
      ? state.allBountiesMap
      : {
        ...state.allBountiesMap,
        [payload.bountyAddress]: payload,
      }
  }),

}, initialState);
