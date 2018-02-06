import { createAction, handleActions } from 'redux-actions'

// constant
const STATE_API = [{"constant":false,"inputs":[{"name":"amounts","type":"uint256[]"}],"name":"sum","outputs":[{"name":"totalAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[]"},{"name":"amounts","type":"uint256[]"}],"name":"mintMultiples","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"request","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[]"},{"name":"amounts","type":"uint256[]"}],"name":"transferMulitples","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"algoId","type":"uint256"}],"name":"buyAlgo","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"mainState","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
const STATE_CONTRACT = '0x80eAc850A1D6A4Bb75cFDdF834ad6ECC327c7AD8';
const GET_PURCHASED_STATE_REQUEST = 'app/algorithmns/getPurchasedStateRequest';
const GET_PURCHASED_STATE_RESPONSE = 'app/algorithmns/getPurchasedStateResponse';
const BUY_ALGO_REQUEST = 'app/algorithmns/buyAlgoRequest';
const BUY_ALGO_RESPONSE = 'app/algorithmns/buyAlgoResponse';

const initialState = {
  order: ['1', '2', '3', '4'],
  map: {
    1: {
      title: 'IMDB Sentiment Analyzer',
      thumbnail: 'http://www.polyvista.com/blog/wp-content/uploads/2015/06/sentiment-customer-exp-large.png',
      type: 'text',
      model: 'https://transcranial.github.io/keras-js-demos-data/imdb_bidirectional_lstm/imdb_bidirectional_lstm.bin',
      stars: 4,
      description: 'Determine sentiment from movie reviews.',
      downloads: 438,
    },
    2: {
      title: 'Animal\'s Breed Identifier',
      thumbnail: 'https://images.wagwalkingweb.com/media/articles/dog/pancreatic-exocrine-neoplasia/pancreatic-exocrine-neoplasia.jpg',
      stars: 3,
      description: 'Identify animal\'s breeds in your picture.',
      downloads: 7629,
      type: 'image_recognition',
      model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
    },
    3: {
      title: 'Tools Identifier',
      thumbnail: 'https://cimg2.ibsrv.net/cimg/www.doityourself.com/660x300_100-1/514/Tools-199514.jpg',
      stars: 3,
      description: 'Identify tools in your picture.',
      downloads: 7629,
      type: 'image_recognition',
      model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
    },
    4: {
      title: 'Fashion Items Scanner',
      thumbnail: 'https://d2ot5om1nw85sh.cloudfront.net/image/home/couple.jpg',
      stars: 3.9,
      description: 'Identify fashion items from image',
      downloads: 12901,
      type: 'image_recognition',
      model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
    },
  },
  purchased: {},
  isRequestingPurchasedState: false,
  isBuyingAlgo: false,
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

}, initialState);
