import { createAction, handleActions } from 'redux-actions';

const API_ADDRESS = process.env.NODE_ENV === 'development'
  ? ''
  : 'https://cors-anywhere.herokuapp.com/http://104.198.104.19:8881';

const LOGOUT = 'app/user/logout';
const LOGIN = 'app/user/login';
const SET_USER = 'app/user/setUser';
const SIGNUP_REQUEST = 'app/user/signupRequest';
const SIGNUP_RESPONSE = 'app/user/signupResponse';
const GET_USER_REQUEST = 'app/user/getUserRequest';
const GET_USER_RESPONSE = 'app/user/getUserResponse';

const initialState = {
  jwt: localStorage.getItem('jwt'),
  firstName: '',
  lastName: '',
  emailAddress: '',
  hasSignedUp: false,
  isSigningUp: false,
  isFetchingUser: true,
};

export const setUser = createAction(SET_USER);

export const logout = () => dispatch => {
  localStorage.setItem('jwt', '');
  dispatch(createAction(LOGOUT)());
}

export const login = () => async (dispatch, getState) => {
  const {
    metamask: { hasWeb3, isLocked, accounts },
  } = getState();

  if (!hasWeb3 || isLocked) {
    return null;
  }

  const account = accounts[0];

  const res = await fetch(`${API_ADDRESS}/get_seed`, {
    body: JSON.stringify({ account }),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  });

  const json = await res.json();

  const { error, payload: seed } = json;

  if (error) {
    return null;
  }

  function toHex(s) {
    var hex = '';
    for(var i=0;i<s.length;i++) { hex += '' + s.charCodeAt(i).toString(16); }
    return `0x${hex}`;
  }

  const message = toHex(seed);

  const payload = {
    id: 1,
    method: 'personal_sign',
    params: [ account, message ],
  };

  window.web3.currentProvider.sendAsync(payload, async (err, data) => {
    if (err) {
      return null;
    }

    const res = await fetch(`${API_ADDRESS}/authenticate`, {
      body: JSON.stringify({ sig: data.result, account }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });

    const json = await res.json();

    if (json.error) {
      return null;
    }

    const { jwt, user } = json.payload;

    localStorage.setItem('jwt', jwt);
    dispatch(createAction(LOGIN)(jwt));
    dispatch(setUser(user));
  });
};

const signupRequest = createAction(SIGNUP_REQUEST);
const signupResponse = createAction(SIGNUP_RESPONSE);
export const signup = ({ firstName, lastName, emailAddress }) => async (dispatch, getState) => {
  const {
    metamask: { hasWeb3, isLocked, accounts },
    user: { jwt },
  } = getState();

  if (!hasWeb3 || isLocked || !jwt) {
    return null;
  }

  dispatch(signupRequest());

  const account = accounts[0];

  const res = await fetch(`${API_ADDRESS}/signup`, {
    body: JSON.stringify({
      firstName,
      lastName,
      emailAddress,
      address: account,
    }),
    headers: {
      'content-type': 'application/json',
      Authorization: jwt,
    },
    method: 'POST',
  });

  try {
    const json = await res.json();

    console.log(json);

    if (json.error) {
      dispatch(signupResponse(new Error(json.payload)));
      return json.payload;
    }

    dispatch(signupResponse(json.payload[0]))
    return json.payload;
  } catch (e) {
    dispatch(signupResponse(e));
    return e.message;
  }
}

const getUserResponse = createAction(GET_USER_RESPONSE);
const getUserRequest = createAction(GET_USER_REQUEST);
export const getUser = () => async (dispatch, getState) => {
  dispatch(getUserRequest());
  const { user: { jwt } } = getState();

  try {
    const res = await fetch(`${API_ADDRESS}/get_user`, {
      headers: {
        Authorization: jwt,
      },
    });

    const json = await res.json();

    if (json.error) {
      dispatch(getUserResponse(new Error(json.payload)));
      return json;
    }

    dispatch(getUserResponse(json.payload));
  } catch (e) {
    dispatch(getUserResponse(e));
  }
}

export default handleActions({

  [LOGOUT]: state => ({ ...state, jwt: '' }),
  [LOGIN]: (state, { payload }) => ({ ...state, jwt: payload }),

  [SET_USER]: (state, { payload }) => {
    const {
      firstName = '',
      lastName = '',
      emailAddress = '',
    } = payload || {};

    return {
      ...state,
      firstName,
      lastName,
      emailAddress,
      hasSignedUp: !!payload,
    };
  },

  [SIGNUP_REQUEST]: state => ({ ...state, isSigningUp: true }),
  [SIGNUP_RESPONSE]: (state, { error, payload }) => {
    if (error) {
      return {
        ...state,
        isSigningUp: false,
      };
    }

    return {
      ...state,
      isSigningUp: false,
      hasSignedUp: true,
      firstName: payload.firstName,
      lastName: payload.lastName,
      emailAddress: payload.emailAddress,
    }
  },

  [GET_USER_REQUEST]: state => ({ ...state, isFetchingUser: true }),
  [GET_USER_RESPONSE]: (state, { error, payload }) => {
    if (error) {
      return {
        ...state,
        isFetchingUser: false,
      };
    }

    return {
      ...state,
      isFetchingUser: false,
      hasSignedUp: true,
      firstName: payload.firstName,
      lastName: payload.lastName,
      emailAddress: payload.emailAddress,
    };
  }

}, initialState);
