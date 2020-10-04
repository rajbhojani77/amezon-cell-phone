let Promise;
const squel = require('squel');

exports.setup = (options) => {
  Promise = options.Promise;
};

exports.up = (db) => new Promise((resolve) => {
  const data = squel.insert().into('roles').setFieldsRows([{ role: 'Admin' }, { role: 'Reviewer' }]).toString();
  resolve(data);
})
  .then((data) => db.runSql(data));
exports.down = (db) => new Promise(((resolve) => {
  const data = 'delete from Users';
  resolve(data);
}))
  .then((data) => db.runSql(data));


exports.meta = {
  version: 1,
};
