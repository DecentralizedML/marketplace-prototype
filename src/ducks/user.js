import { createAction, handleActions } from 'redux-actions';

const API_ADDRESS = process.env.NODE_ENV === 'development'
  ? ''
  : 'https://cors-anywhere.herokuapp.com/http://104.198.104.19:8881';
const LOGOUT = 'app/user/logout';
const LOGIN = 'app/user/login';

const initialState = {
  jwt: localStorage.getItem('jwt'),
};

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

    localStorage.setItem('jwt', json.payload);
    dispatch(createAction(LOGIN)(json.payload));
  });
}

export default handleActions({

  [LOGOUT]: state => ({ ...state, jwt: '' }),
  [LOGIN]: (state, { payload }) => ({ ...state, jwt: payload }),

}, initialState);
