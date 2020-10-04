const fs = require('fs');
const path = require('path');

let Promise;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = (options) => {
  Promise = options.Promise;
};

exports.up = (db) => {
  const filePath = path.join(__dirname, 'sqls', '20200205055910-role-up.sql');
  return new Promise(((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  }))
    .then((data) => db.runSql(data));
};

exports.down = (db) => {
  const filePath = path.join(__dirname, 'sqls', '20200205055910-role-down.sql');
  return new Promise(((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  }))
    .then((data) => db.runSql(data));
};

exports.meta = {
  version: 1,
};
