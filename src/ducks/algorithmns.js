import { createAction, handleActions } from 'redux-actions'

// constant

const initialState = {
  order: ['aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag'],
  map: {
    aa: {
      title: 'Sentienment Analyzer',
      thumbnail: 'http://www.polyvista.com/blog/wp-content/uploads/2015/06/sentiment-customer-exp-large.png',
      stars: 4,
      description: 'Identify puppies in your picture',
      downloads: 438,
    },
    ab: {
      title: 'Dog Scanner',
      thumbnail: 'https://images.wagwalkingweb.com/media/articles/dog/pancreatic-exocrine-neoplasia/pancreatic-exocrine-neoplasia.jpg',
      stars: 4,
      description: 'Identify puppies in your picture',
      downloads: 7629,
    },
    ac: {
      title: 'Cat Scanner',
      thumbnail: 'https://news.nationalgeographic.com/content/dam/news/photos/000/755/75552.ngsversion.1422285553360.adapt.1900.1.jpg',
      stars: 4,
      description: 'Identify puppies in your picture',
      downloads: 7629,
    },
    ad: {
      title: 'Fish Finder',
      thumbnail: 'https://d3uf2ssic990td.cloudfront.net/images/4919/43c68b3a-0ac3-44aa-acb3-582dfe0c42ee/Finding_Nemo.jpg',
      stars: 4,
      description: 'Identify puppies in your picture',
      downloads: 7629,
    },
    ae: {
      title: 'Profanity Filter',
      thumbnail: 'https://fm.cnbc.com/applications/cnbc.com/resources/img/editorial/2013/06/04/100789560-GettyImages-168277092.530x298.jpg?v=1463507486',
      stars: 4,
      description: 'Identify puppies in your picture',
      downloads: 7629,
    },
    af: {
      title: 'Bear Scanner',
      thumbnail: 'https://romaniadacia.files.wordpress.com/2016/10/123.jpg',
      stars: 4,
      description: 'Identify puppies in your picture',
      downloads: 7629,
    },
    ag: {
      title: 'Pig Scanner',
      thumbnail: 'https://img1.southernliving.timeinc.net/sites/default/files/styles/4_3_horizontal_inbody_900x506/public/image/2016/09/main/pink-pig-face-119880531_high.jpg?itok=10KlPD29',
      stars: 4,
      description: 'Identify puppies in your picture',
      downloads: 7629,
    },
  },
};

export default handleActions({

}, initialState);
