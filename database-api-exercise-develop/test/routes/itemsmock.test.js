/* eslint-disable no-undef */
const fs = require('fs');
const item = require('../../models/items');

jest.mock('../../config/config');
const db = require('../../config/config');

const jsonString = fs.readFileSync('test/data/items.json');
const items = JSON.parse(jsonString);

beforeEach(() => {
  jest.clearAllMocks();
});
itemObj = {
  id: 2,
  asin: 'B0009N5L7K',
  brand: 'Motorola2',
  title: 'Motorola I265 phone',
  url: 'https://www.amazon.com/Motorola-i265-I265-phone/dp/B0009N5L7K',
  image: 'https://m.media-amazon.com/images/I/419WBAVDARL._AC_UY218_SEARCH213888_FMwebp_QL75_.jpg',
  rating: 2.9,
  reviewurl: 'https://www.amazon.com/product-reviews/B0009N5L7K',
  totalreviews: 7,
  prices: '$ 49.99',
  createdat: '2020-02-16T09:36:26.275Z',
  inactive: false,
  updatedat: '2020-02-16T09:36:26.275Z',
};
returnId = { id: 2 };

test('item.findById', () => {
  const mock = db.oneOrNone.mockReturnValue(itemObj);
  const result = item.findById(2);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(itemObj);
});

test('item.itemReviews', () => {
  const mock = db.query.mockReturnValue(itemObj);
  const result = item.itemReviews(2);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(itemObj);
});

test('item.create', () => {
  const mock = db.one.mockReturnValue(returnId);
  const result = item.create(itemObj);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(returnId);
});

test('item.edit', () => {
  const mock = db.oneOrNone.mockReturnValue(returnId);
  const result = item.edit(itemObj);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(returnId);
});


test('item.remove', () => {
  const mock = db.oneOrNone.mockReturnValue(returnId);
  const result = item.remove(2);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(returnId);
});

itemlist = items.data;

db.manyOrNone.mockImplementation(() => itemlist);
test('item.list', () => {
  const result = item.list(1, 'id', 'ASC');
  expect(db.manyOrNone).toHaveBeenCalled();
  expect(db.manyOrNone).toHaveBeenCalledTimes(1);
  expect(result).toBe(itemlist);
});
