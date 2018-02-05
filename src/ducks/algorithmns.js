import { createAction, handleActions } from 'redux-actions'

// constant

const initialState = {
  order: ['aa', 'ab', 'ac', 'ae'],
  map: {
    aa: {
      title: 'Sentiment Analyzer',
      thumbnail: 'http://www.polyvista.com/blog/wp-content/uploads/2015/06/sentiment-customer-exp-large.png',
      type: 'text',
      model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
      stars: 4,
      description: 'Determine sentiment from texts.',
      downloads: 438,
    },
    ab: {
      title: 'Animal\'s Breed Identifier',
      thumbnail: 'https://images.wagwalkingweb.com/media/articles/dog/pancreatic-exocrine-neoplasia/pancreatic-exocrine-neoplasia.jpg',
      stars: 3,
      description: 'Identify animal\'s breeds in your picture.',
      downloads: 7629,
      type: 'image_recognition',
      model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
    },
    ac: {
      title: 'Tools Identifier',
      thumbnail: 'https://cimg2.ibsrv.net/cimg/www.doityourself.com/660x300_100-1/514/Tools-199514.jpg',
      stars: 3,
      description: 'Identify tools in your picture.',
      downloads: 7629,
      type: 'image_recognition',
      model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
    },
    ae: {
      title: 'Fashion Items Scanner',
      thumbnail: 'https://d2ot5om1nw85sh.cloudfront.net/image/home/couple.jpg',
      stars: 3.9,
      description: 'Identify fashion items from image',
      downloads: 12901,
      type: 'image_recognition',
      model: 'https://transcranial.github.io/keras-js-demos-data/inception_v3/inception_v3.bin',
    },
  },
};

export default handleActions({

}, initialState);
