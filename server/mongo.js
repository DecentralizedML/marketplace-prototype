const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// @5#6&tZ63aX@
const url = 'mongodb://dev2:wCcdAoaTD67G@ds059365.mlab.com:59365/dml-proto';
// const dbName = 'dml-proto';

const defer = new Promise((resolve, reject) => {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log("Failed to connect to server");
      return reject(err);
    }
    console.log("Connected successfully to server");
   
    resolve(client);
  });
});

const ready = () => defer;

const insertJob = job => {
  return ready()
    .then(client => {
      const jobs = client.db('dml-proto').collection('jobs');
      return new Promise((resolve, reject) => {
        jobs.insert(job, (err, doc) => {
          if (err) {
            console.log(err);
            console.log('Failed to create job.')
            reject(err);
          } else {
            console.log('Successfuly created job.');
            resolve(doc.ops);
          }
        });
      });
    });
};

const getActiveJob = user_public_key => {
  return ready()
    .then(client => {
      const jobs = client.db('dml-proto').collection('jobs');
      const query = {
        [`completed.${user_public_key}`]: { $ne: true },
      };

      return new Promise((resolve, reject) => {
        jobs.findOne(query, (err, result) => {
          if (err) {
            console.log(err);
            console.log('Failed to get active job.');
            reject(err);
          } else {
            const { completed, ...rest } = result || {};
            console.log('Successfuly get active job.');
            resolve(rest);
          }
        });
      });
    })
}

const getCompletedJobs = user_public_key => {
  return ready()
    .then(client => {
      const jobs = client.db('dml-proto').collection('jobs');
      const query = {
        [`completed.${user_public_key}`]: { $eq: true },
      };

      return new Promise((resolve, reject) => {
        jobs.find(query).toArray((err, result) => {
          if (err) {
            console.log(err);
            console.log('Failed to get completed jobs.');
            reject(err);
          } else {
            console.log('Successfuly get completed jobs.');
            resolve(result.map(({ completed, ...doc }) => doc));
          }
        });
      });
    })
}

const getJobResults = job_id => {
  return ready()
    .then(client => {
      const results = client.db('dml-proto').collection('results');
      const query = { job_id: job_id.toString() };
      return new Promise((resolve, reject) => {
        results.find(query).toArray((error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        })
      });

    })
}

const getJobs = ({ job_id, requestor, algo_id }) => {
  return ready()
    .then(client => {
      const jobs = client.db('dml-proto').collection('jobs');
      // const results = client.db('dml-proto').collection('results');
      const query = { requestor, algo_id };

      if (job_id) {
        query._id = ObjectId(job_id);
      }

      return new Promise((resolve, reject) => {
        jobs.find(query).toArray((error, data) => {
          if (error) {
            reject(error);
          } else {
            if (!data.length) {
              resolve([]);
            }

            let jobProcessed = 0;
            data.forEach(async result => {
              const userResults = []
              const jobResults = await getJobResults(result._id);
              
              jobResults.forEach(dataByUser => {
                dataByUser.results.forEach(resultByuser => userResults.push(resultByuser))
              });
              
              jobProcessed++;
              result.results = userResults;

              if (jobProcessed === data.length) {
                resolve(data)
              }
            })
          }
        })
      });

    });
}

const postJobResult = jobResult => {
  return ready()
    .then(client => {
      const jobs = client.db('dml-proto').collection('jobs');
      const resultsCol = client.db('dml-proto').collection('results');
      const { job_id, user_public_key } = jobResult;
      const query = { _id: ObjectId(job_id) };
      const resultQuery = { job_id, user_public_key };

      return new Promise((resolve, reject) => {

        jobs.findOne(query, (findJobError, result) => {
          if (findJobError) {
            reject(findJobError);
          } else {
            if (!result) {
              return reject(new Error(`Cannot find job by id: ${job_id}`));
            }

            resultsCol.findOne(resultQuery, (findResultError, data) => {
              if (findResultError) {
                return reject(findResultError);
              }

              if (data) {
                return reject(new Error(`Cannot post result twice for job_id: ${job_id}`));
              }

              resultsCol.insert(jobResult, (insertError, data) => {
                if (insertError) {
                  reject(insertError);
                } else {
                  jobs.findOneAndUpdate(query, { $set: { [`completed.${user_public_key}`]: true } }, (updateError, result) => {
                    if (updateError) {
                      console.log(updateError)
                      resultsCol.deleteOne({ _id: ObjectId(data.ops[0]._id) }, (deleteError, deleteData) => {
                        console.log(deleteError)
                        if (deleteError) return reject(deleteError);
                        return reject(updateError);
                      })
                      return;
                    }

                    resolve(data.ops);
                  })
                }
              });
            })

          }
        });
      });
      
    })
}

const getBountyDetail = address => {
  return ready()
    .then(client => {
      const bounties = client.db('dml-proto').collection('bounties');
      const query = { address: { $eq: address } };
      return new Promise((resolve, reject) => {
        bounties.findOne(query, (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (!result) return reject(new Error('Cannot find bounty address: ' + address));
            resolve(result);
          }
        })
      });
    });
}

const updateBountyDetail = bounty => {
  return ready()
    .then(client => {
      const bounties = client.db('dml-proto').collection('bounties');
      const query = { address: { $eq: bounty.address } };

      return new Promise((resolve, reject) => {
        bounties.findOne(query, (bountyError, result) => {
          if (bountyError) {
            reject(bountyError);
          } else {
            if (result) {
              return bounties.findOneAndReplace(query, bounty, (replaceError, replaceResult) => {
                if (replaceError) {
                  console.log(replaceError);
                  console.log('Failed to update bounty.')
                  reject(replaceError);
                } else {
                  if (!replaceResult.value) {
                    return reject(new Error('Failed to update bounty'));
                  }
                  console.log('Successfuly updated bounty.');
                  resolve({
                    ...bounty,
                    _id: replaceResult.value._id,
                  });
                }
              });
            }

            bounties.insert(bounty, (err, doc) => {
              if (err) {
                console.log(err);
                console.log('Failed to update bounty.')
                reject(err);
              } else {
                console.log('Successfuly updated bounty.');
                resolve(doc.ops[0]);
              }
            });
          }
        });
      });
    });
};


module.exports = {
  ready,
  insertJob,
  getActiveJob,
  getCompletedJobs,
  postJobResult,
  getJobs,
  updateBountyDetail,
  getBountyDetail,
};
