/* eslint-disable no-undef */
const fs = require('fs');
const user = require('../../models/user');

jest.mock('../../config/config');
const db = require('../../config/config');

const jsonString = fs.readFileSync('test/data/users.json');
const users = JSON.parse(jsonString);
beforeEach(() => {
  jest.clearAllMocks();
});
userObj = {
  id: 2,
  username: 'Amazon Customer',
  password: '4b925451-5186-11ea-b149-f9d37bea0c16',
};
returnId = { id: 11090 };

test('user.findByUserName', () => {
  const mock = db.oneOrNone.mockReturnValue(userObj);
  const result = user.findByUserName('Admin');
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(userObj);
});

test('user.create', () => {
  const mock = db.oneOrNone.mockReturnValue(returnId);
  const result = user.create(userObj);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(returnId);
});

test('user.edit', () => {
  const mock = db.oneOrNone.mockReturnValue(returnId);
  const result = user.edit(userObj);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(returnId);
});


test('user.remove', () => {
  const mock = db.oneOrNone.mockReturnValue(returnId);
  const result = user.remove(11090);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(2);
  expect(result).toBe(returnId);
});

userlist = users.data;

db.manyOrNone.mockImplementation(() => userlist);
test('user.list', () => {
  const result = user.list(1, 'id', 'ASC');
  expect(db.manyOrNone).toHaveBeenCalled();
  expect(db.manyOrNone).toHaveBeenCalledTimes(1);
  expect(result).toBe(userlist);
});
