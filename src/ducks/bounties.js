import { createAction, handleActions } from 'redux-actions'
import {
  BOUNTY_FACTORY_ADDRESS,
  BOUNTY_FACTORY_ABI,
  BOUNTY_ABI,
} from '../utils/constants';
import asyncQueue from '../utils/async-queue';

const API_ADDRESS = '';
// const API_ADDRESS = 'https://cors-anywhere.herokuapp.com/http://104.198.104.19:8881'

const GET_ALL_BOUNTIES_REQUEST = 'app/bounties/getAllBountiesRequest';
const GET_ALL_BOUNTIES_RESPONSE = 'app/bounties/getAllBountiesResponse';
const GET_ALL_BOUNTIES_CREATED_BY_ME_REQUEST = 'app/bounties/getAllBountiesCreatedByMeRequest';
const GET_ALL_BOUNTIES_CREATED_BY_ME_RESPONSE = 'app/bounties/getAllBountiesCreatedByMeResponse';
const GET_BOUNTY_REQUEST = 'app/bounties/getBountyRequest';
const GET_BOUNTY_RESPONSE = 'app/bounties/getBountyResponse';
const CREATE_NEW_BOUNTY_REQUEST = 'app/bounties/createNewBountyRequest';
const CREATE_NEW_BOUNTY_RESPONSE = 'app/bounties/createNewBountyResponse';
const UPDATE_BOUNTY_DETAIL_REQUEST = 'app/bounties/updateBountyDetailRequest';
const UPDATE_BOUNTY_DETAIL_RESPONSE = 'app/bounties/updateBountyDetailResponse';

const initialState = {
  allBounties:[],
  allBountiesMap: {},
  createdByMe: [],
  isLoadingAllBounties: false,
  isLoadingAllBountiesCreatedByMe: false,
  isCreatingBounty: false,
  isUpdatingBounty: false,
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

  asyncQueue.add(async () => {
    try {
      const data = await promisify(bountyFactory.getAllBounties);
      dispatch(getAllBountiesResponse(data));
    } catch (e) {
      dispatch(getAllBountiesResponse(e));
    }
  });
}

const getAllBountiesCreatedByMeRequest = createAction(GET_ALL_BOUNTIES_CREATED_BY_ME_REQUEST);
const getAllBountiesCreatedByMeResponse = createAction(GET_ALL_BOUNTIES_CREATED_BY_ME_RESPONSE);
export const getAllBountiesCreatedByMe = () => (dispatch, getState) => {
  const bountyFactory = getFactoryContract(getState);

  if (!bountyFactory) {
    return;
  }

  const { metamask: { accounts } } = getState();

  dispatch(getAllBountiesCreatedByMeRequest());

  asyncQueue.add(async () => {
    try {
      const data = await promisify(bountyFactory.getBountiesByCreator, accounts[0]);
      dispatch(getAllBountiesCreatedByMeResponse(data));
    } catch (e) {
      dispatch(getAllBountiesCreatedByMeResponse(e));
    }
  });
}

const getBountyRequest = createAction(GET_BOUNTY_REQUEST);
const getBountyResponse = createAction(GET_BOUNTY_RESPONSE);
export const getBounty = address => (dispatch, getState) => {
  const bounty = getBountyContract(address, getState);

  if (!bounty) {
    return null;
  }

  dispatch(getBountyRequest());

  asyncQueue.add(async () => {
    try {
      const data = await promisify(bounty.getData)
      const response = await fetch(`${API_ADDRESS}/bounty_detail/${address}`);

      const ret = {
        bountyAddress: address,
        prizes: data[1],
        winners: data[2],
        participants: data[3],
        status: data[4],
        title: data[0],
      };

      const { error, payload } = await response.json();

      if (!error) {
        ret.description = payload.description;
        ret.evaluation = payload.evaluation;
        ret.imageUrl = payload.imageUrl;
        ret.rules = payload.rules;
        ret.data = payload.data;
        ret.subtitle = payload.subtitle;
        ret.thumbnailUrl = payload.thumbnailUrl;
      }

      dispatch(getBountyResponse(ret));
    } catch (e) {
      dispatch(getBountyResponse(e));
    }
  });
}

const createNewBountyRequest = createAction(CREATE_NEW_BOUNTY_REQUEST);
const createNewBountyResponse = createAction(CREATE_NEW_BOUNTY_RESPONSE);
export const createNewBounty = (name, prizes) => (dispatch, getState) => {
  const bountyFactory = getFactoryContract(getState);

  if (!bountyFactory) {
    return;
  }

  dispatch(createNewBountyRequest());

  return new Promise((resolve, reject) => {
    asyncQueue.add(async () => {
      try {
        const data = await promisify(bountyFactory.createBounty, name, prizes);
        dispatch(createNewBountyResponse(data));
        resolve(data);
      } catch (e) {
        dispatch(createNewBountyResponse(e));
        reject(e);
      }
    });
  })
}

const updateBountyDetailRequest = createAction(UPDATE_BOUNTY_DETAIL_REQUEST);
const updateBountyDetailResponse = createAction(UPDATE_BOUNTY_DETAIL_RESPONSE);
export const updateBountyDetail = bounty => async (dispatch, getState) => {
  dispatch(updateBountyDetailRequest());

  try {
    const response = await fetch(`${API_ADDRESS}/update_bounty_detail/${bounty.address}`, {
      body: JSON.stringify(bounty),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });

    const { error, payload } = await response.json();

    if (error) {
      throw new Error(payload);
    }

    dispatch(updateBountyDetailResponse(payload));
    return payload;
  } catch (error) {
    dispatch(updateBountyDetailResponse(error));
    return error;
  }
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

  [GET_ALL_BOUNTIES_CREATED_BY_ME_REQUEST]: state => ({ ...state, isLoadingAllBountiesCreatedByMe: true }),

  [GET_ALL_BOUNTIES_CREATED_BY_ME_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isLoadingAllBountiesCreatedByMe: false,
    createdByMe: error
      ? state.createdByMe
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

  [CREATE_NEW_BOUNTY_REQUEST]: state => ({ ...state, isCreatingBounty: true }),
  [CREATE_NEW_BOUNTY_RESPONSE]: state => ({ ...state, isCreatingBounty: false }),

  [UPDATE_BOUNTY_DETAIL_REQUEST]: state => ({ ...state, isUpdatingBounty: true }),
  [UPDATE_BOUNTY_DETAIL_RESPONSE]: (state, { payload, error }) => ({
    ...state,
    isUpdatingBounty: false,
    allBountiesMap: error
      ? state.allBountiesMap
      : {
        ...state.allBountiesMap,
        [payload.address]: {
          ...state.allBountiesMap[payload.address],
          ...payload,
        },
      }
  }),


}, initialState);
