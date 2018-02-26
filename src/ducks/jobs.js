import { createAction, handleActions } from 'redux-actions'

const CREATE_JOB = asyncActionCreator('app/jobs/createJob');
const GET_JOB_HISTORY_BY_ALGO = asyncActionCreator('app/jobs/getJobHistoryByAlgo');

export const createJob = ({ maxDevice, rewardsPerDevice, algoId }) => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(CREATE_JOB.start());

  const [account] = accounts;

  try {
    const body = {
      reward: Number(rewardsPerDevice),
      algo_id: algoId,
      requestor: account,
    };

    const response = await fetch('https://cors-anywhere.herokuapp.com/http://104.198.104.19:8881/createJob', {
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    });

    const { error, payload } = await response.json();

    if (error) {
      throw new Error(payload);
    }

    dispatch(CREATE_JOB.done({ algoId, response }));
  } catch (error) {
    console.log(error);
    dispatch(CREATE_JOB.done(error));
  }
}

export const getJobHistoryByAlgo = algoId => async (dispatch, getState) => {
  const { metamask: { isLocked, hasWeb3, accounts } } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  dispatch(GET_JOB_HISTORY_BY_ALGO.start());

  const [account] = accounts;

  try {
    const body = {
      algo_id: algoId,
      requestor: account,
    };

    const response = await fetch('https://cors-anywhere.herokuapp.com/http://104.198.104.19:8881/get_job_history_by_algo', {
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });

    const { error, payload } = await response.json();

    if (error) {
      throw new Error(payload);
    }

    dispatch(GET_JOB_HISTORY_BY_ALGO.done({ algoId, response: payload }));
  } catch (error) {
    console.log(error);
    dispatch(GET_JOB_HISTORY_BY_ALGO.done(error));
  }

}

const initialState = {
  isCreatingJob: false,
  isFetchingJobHistory: false,
  createJobErrorMessage: '',
  byAlgo: {},
};

// "reward": 100,
// "requestor": "testing_keys",
// "algo_id": "d766f147-1d61-49a8-9955-30432d94f51f",
// "completed": {},
// "_id": "5a8f8697b85f6c5de0d24cbe"
export default handleActions({

  [CREATE_JOB.START]: state => ({ ...state, isCreatingJob: true }),

  [CREATE_JOB.DONE]: (state, { error, payload }) => ({
    ...state,
    isCreatingJob: false,
    createJobErrorMessage: error ? payload.message : '',
    byAlgo: {
      ...state.byAlgo,
      [payload.algoId]: error
        ? undefined
        : payload.response
    },
  }),

  [GET_JOB_HISTORY_BY_ALGO.START]: state => ({ ...state, isFetchingJobHistory: true }),

  [GET_JOB_HISTORY_BY_ALGO.DONE]: (state, { error, payload }) => {
    if (error) {
      return { ...state, isFetchingJobHistory: false };
    }

    const jobsByAlgo = { ...state.byAlgo[payload.algoId] };

    payload.response.forEach(job => {
      jobsByAlgo[job._id] = job;
    });

    return {
      ...state,
      byAlgo: {
        ...state.byAlgo,
        [payload.algoId]: jobsByAlgo,
      },
      isFetchingJobHistory: false,
    };
  },


}, initialState);

function asyncActionCreator(namesapce) {
  const START = `${namesapce}Start`;
  const DONE = `${namesapce}Done`;
  return {
    START,
    DONE,
    start: createAction(`${namesapce}Start`),
    done: createAction(`${namesapce}Done`),
  }
}
