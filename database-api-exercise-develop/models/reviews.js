const squel = require('squel');
const escapeString = require('sql-string-escape');
const db = require('../config/config');

const squelPostgres = squel.useFlavour('postgres');

// EMPTY Review OBJECT
const Reviews = {};
let query = null;

// GET REVIEWS BY PAGE_NO
Reviews.list = (PAGE_NO, isVerified, body, orderby, order) => {
  const offset = (PAGE_NO - 1) * 10;
  query = squelPostgres
    .select()
    .from('reviews')
    .join(squel.select().field('id', 'user_id').field('username').from('users'), 'u', 'u.user_id = reviews.user_id')
    .where('inactive = ?', false)
    .where('verified IN ?', isVerified)
    .where(`LOWER(body) LIKE LOWER('%${body}%')`)
    .order(orderby, order !== 'DESC')
    .offset(offset)
    .limit(10)
    .toString();
  return db.manyOrNone(query);
};

// FIND Review BY ID
Reviews.findById = (id) => {
  query = squelPostgres
    .select()
    .from('reviews')
    .where('id = ?', id)
    .where('inactive = ?', false)
    .toString();
  return db.oneOrNone(query);
};

// CREATE A Review (ADD TO Review TABLE)
Reviews.create = (reviews) => {
  query = squelPostgres
    .insert({
      stringFormatter(str) {
        return escapeString(str);
      },
    })
    .into('reviews')
    .setFieldsRows([reviews])
    .returning('*')
    .toString();
  return db.one(query);
};

// EDIT Review BY ID
Reviews.edit = (reviews) => {
  query = squelPostgres
    .update({
      stringFormatter(str) {
        return escapeString(str);
      },
    })
    .table('reviews')
    .setFields(reviews)
    .where('id = ?', reviews.id)
    .returning('*')
    .toString();
  return db.oneOrNone(query);
};

// REMOVE Review BY ID
Reviews.remove = (id) => {
  query = squelPostgres
    .update()
    .table('reviews')
    .set('inactive', true)
    .where('id = ?', id)
    .returning('*')
    .toString();
  return db.oneOrNone(query);
};

module.exports = Reviews;
