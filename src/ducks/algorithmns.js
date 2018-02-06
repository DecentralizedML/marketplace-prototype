import { createAction, handleActions } from 'redux-actions'

// constant
const STATE_API = [{"constant":false,"inputs":[{"name":"algoId","type":"uint256"}],"name":"buyAlgo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"mainState","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"}];
const STATE_CONTRACT = '0xae73165758B5E43aE4cbaea3cf5D36a7A5ADa976';
const GET_PURCHASED_STATE_REQUEST = 'app/algorithmns/getPurchasedStateRequest';
const GET_PURCHASED_STATE_RESPONSE = 'app/algorithmns/getPurchasedStateResponse';

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

}, initialState);
