const admin = require('firebase-admin');
const config = require('./cert.json');
admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: "https://decentralizedml-e05c9.firebaseio.com",
  storageBucket: "bounty-submissions.appspot.com",
});
const bountyBucket = admin.storage().bucket('bounty-submissions');
const algoBucket = admin.storage().bucket('algo-files');

module.exports = {
  bountyBucket,
  algoBucket,
};
