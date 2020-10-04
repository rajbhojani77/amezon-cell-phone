const squel = require('squel');
const escapeString = require('sql-string-escape');
const db = require('../config/config');

const squelPostgres = squel.useFlavour('postgres');

// EMPTY ITEM OBJECT
const Item = {};
let query = null;

// GET ITEMS BY PAGE_NO
Item.list = (PAGE_NO, brand, orderby, order) => {
  const offset = (PAGE_NO - 1) * 10;
  query = squelPostgres
    .select()
    .from('items')
    .where(`LOWER(brand) LIKE LOWER('%${brand}%')`)
    .where('inactive = ?', false)
    .offset(offset)
    .order(orderby, order !== 'DESC')
    .limit(10)
    .toString();
  return db.manyOrNone(query);
};

Item.itemReviews = (id) => {
  query = squelPostgres
    .select()
    .from('reviews')
    .left_join(squel.select().field('id').field('username').from('users'), 'u', 'u.id = reviews.user_id')
    .where('reviews.inactive = ?', false)
    .where('reviews.item_id = ?', id)
    .toString();
  return db.query(query);
};

Item.findById = (id) => {
  query = squelPostgres
    .select()
    .from('items').where('items.id = ?', id).where('items.inactive = ?', false)
    .toString();
  return db.oneOrNone(query);
};

// CREATE A ITEM (ADD TO ITEM TABLE)
Item.create = (items) => {
  query = squelPostgres.insert({
    stringFormatter(str) {
      return escapeString(str);
    },
  }).into('Items')
    .setFieldsRows([items]).returning('*')
    .toString();
  return db.one(query);
};

// EDIT ITEM BY ID
Item.edit = (items) => {
  query = squelPostgres.update({
    stringFormatter(str) {
      return escapeString(str);
    },
  })
    .table('items')
    .setFields(items)
    .where('id = ?', items.id)
    .returning('*')
    .toString();
  return db.oneOrNone(query);
};

// REMOVE ITEM BY ID
Item.remove = (id) => {
  query = squelPostgres.update()
    .table('items')
    .set('inactive', true)
    .where('id = ?', id)
    .returning('*')
    .toString();
  return db.oneOrNone(query);
};

module.exports = Item;
