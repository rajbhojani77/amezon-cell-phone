const bcrypt = require('bcryptjs');
const squel = require('squel');
const escapeString = require('sql-string-escape');
const db = require('../config/config');

const squelPostgres = squel.useFlavour('postgres');
// EMPTY USER OBJECT
const User = {};
let query = null;

// FIND USER BY USERNAME
User.findByUserName = (userName) => {
  query = squel
    .select()
    .from('users')
    .where('username = ?', userName)
    .where('inactive = ?', false)
    .toString();
  return db.oneOrNone(query);
};

// FIND USER BY ID
User.findById = (id, callback) => {
  query = squel
    .select()
    .from('users')
    .where('id = ?', id)
    .where('inactive = ?', false)
    .toString();
  return db.oneOrNone(query).then((user) => {
    callback(null, user);
  });
};

// CREATE A USER (ADD TO USERS TABLE)
User.create = (user) => {
  query = squelPostgres
    .insert({
      stringFormatter(str) {
        return escapeString(str);
      },
    })
    .into('Users')
    .set('username', user.username)
    .set('password', user.password)
    .returning('*')
    .toString();
  return db.oneOrNone(query);
};

// USE BCRYPT TO ENCRYPT PASSWORD
User.addUser = (newUser) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newUser.password, salt);

  return User.create({
    username: newUser.username,
    password: hash,
  });
};

// COMPARE PASSWORD WHEN LOGGING IN
User.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    callback(null, isMatch);
  });
};

User.edit = (reviewer) => {
  query = squelPostgres
    .update({
      stringFormatter(str) {
        return escapeString(str);
      },
    })
    .table('users')
    .setFields(reviewer)
    .where('id = ?', reviewer.id)
    .where('role_id = ?', 2)
    .where('inactive = ?', false)
    .returning('*')
    .toString();
  return db.oneOrNone(query);
};

// REMOVE Review BY ID
User.remove = (id) => {
  query = squelPostgres
    .update()
    .table('reviews')
    .set('inactive', true)
    .where('user_id = ?', id)
    .returning('*')
    .toString();
  db.oneOrNone(query);

  query = squelPostgres
    .update()
    .table('users')
    .set('inactive', true)
    .where('id = ?', id)
    .where('role_id = ?', 2)
    .returning('*')
    .toString();
  return db.oneOrNone(query);
};

// GET ITEMS BY PAGE_NO
User.list = (PAGE_NO, orderby, order) => {
  const offset = (PAGE_NO - 1) * 10;
  query = squelPostgres
    .select()
    .from('users')
    .where('role_id = ?', 2)
    .where('inactive = ?', false)
    .order(orderby, order !== 'DESC')
    .offset(offset)
    .limit(10)
    .toString();
  return db.manyOrNone(query);
};

module.exports = User;
