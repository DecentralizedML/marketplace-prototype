import { createAction, handleActions } from 'redux-actions'

const CREATE_JOB = asyncActionCreator('app/jobs/createJob');

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

    const response = await fetch('/createJob', {
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

    dispatch(CREATE_JOB.done(payload));
  } catch (error) {
    console.log(error);
    dispatch(CREATE_JOB.done(error));
  }
}

const initialState = {
  isCreatingJob: false,
  createJobErrorMessage: '',
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
    [payload._id]: error
      ? undefined
      : payload,
  }),


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
