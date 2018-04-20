import { createAction, handleActions } from 'redux-actions'
import {
  BOUNTY_FACTORY_ADDRESS,
  BOUNTY_FACTORY_ABI,
  BOUNTY_ABI,
} from '../utils/constants';
import asyncQueue from '../utils/async-queue';

const GET_ALL_BOUNTIES_REQUEST = 'app/bounties/getAllBountiesRequest';
const GET_ALL_BOUNTIES_RESPONSE = 'app/bounties/getAllBountiesResponse';
const GET_BOUNTY_REQUEST = 'app/bounties/getBountyRequest';
const GET_BOUNTY_RESPONSE = 'app/bounties/getBountyResponse';
const CREATE_NEW_BOUNTY_REQUEST = 'app/bounties/createNewBountyRequest';
const CREATE_NEW_BOUNTY_RESPONSE = 'app/bounties/createNewBountyResponse';

const initialState = {
  allBounties:[],
  allBountiesMap: {},
  isLoadingAllBounties: false,
  isCreatingBounty: false,
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
export const getBounty = address => (dispatch, getState) => {
  const bounty = getBountyContract(address, getState);

  if (!bounty) {
    return null;
  }

  dispatch(getBountyRequest());

  asyncQueue.add(async () => {
    try {
      const data = await promisify(bounty.getData)
      dispatch(getBountyResponse({
        bountyAddress: address,
        prizes: data[1],
        winners: data[2],
        participants: data[3],
        status: data[4],
        // thumbnailUrl: 'https://kaggle2.blob.core.windows.net/competitions/kaggle/8540/logos/thumb76_76.png?t=2018-02-13-18-59-39',
        thumbnailUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAPFBMVEXX19eOjo7a2tqLi4vd3N3GxsapqamTk5Ozs7OampqsrKzAwMCvr6/JycmIiIiQkJCjo6O7u7vR0dGYmJgw/inwAAACvklEQVR4nO3b7XKqMBRGYUgAQSUo3v+9Hl4/o2214nja7r3Wr840TMkziSLSonBf9dMn8AvCAAOFAQYKAwwUBhgoDDBQGGCgMMBAYYCBwgADhQEGCgMMFAYYKAwwUBhgoDDAQGGAgcIAA4UBBgoDDBQGGCgMMFAYYKAwwEBhgIHCAAOFAQYKAwwUBhgoDDBQGGCgMMBAYYCBwgADhcH/MOjrVxvffIZvNwi79GpNeO8pvt+gK18sLjEwYrCY3WDFINZVmFfVRisGq7mzCGsMjBmE6tkKawahffq6oLZnEJ99T6wDBrYNYkwpPjKxbZA2q3FcbZJng+mSSe8TvV+D2B/nFMa728GwQWzPU7r/OmnZIL8l4tRgkc2o2vk06ML1Lz0aDPk6WPg0SNnrwZhfIuyiG4PYnP9m1eTXjnXnxqBM29P1wSpfBjHUyY1BmdrDjbL2imATqs6PQRmH5Xa7Hq72/zTmZiHYNtAHx9uPjVEn03ky+NC0FaaxVwvBn8H+tuvVQvBncBicLwRvBvutoNGDY4PjNxBhGf0anIb3yalBTJvTNLPN4MggpmHZX24tXTaDF4MDQD7Hy2ZwYfARoMg3gwOD+AlAkW8G+waxqT6f2nkzmDfI7qTcHjA4Mfia4LIZjBvcIbhsBtsGdwmKsIn2De4TnBEsG6QHBCcEiwYp7ntMIIRpcDJnUPSrY9+ZUdDA0dozWdNPx7532GGgNYNZR1sy4Hnlpp1bZ+W59TLOrjRj8FIWDOYvguMFxd83WDevtv3rBsXjF/+HvfkM+R9PDBQGGCgMMFAYYKAwwEBhgIHCAAOFAQYKAwwUBhgoDDBQGGCgMMBAYYCBwgADhQEGCgMMFAYYKAwwUBhgoDDAQGGAgcIAA4UBBgoDDBQGGCgMMFAYYKAwwEBhgIHCAAOFAQYKAwwUBhgoDCaDf8N4LuL6NkZ5AAAAAElFTkSuQmCC',
        title: data[0],
        subtitle: ' - ',
      }));
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

  [CREATE_NEW_BOUNTY_REQUEST]: state => ({ ...state, isCreatingBounty: true }),
  [CREATE_NEW_BOUNTY_RESPONSE]: state => ({ ...state, isCreatingBounty: false }),



}, initialState);
