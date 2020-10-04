/* eslint-disable no-undef */
const fs = require('fs');
const review = require('../../models/reviews');

jest.mock('../../config/config');
const db = require('../../config/config');

const jsonString = fs.readFileSync('test/data/reviews.json');
const reviews = JSON.parse(jsonString);
beforeEach(() => {
  jest.clearAllMocks();
});
reviewObj = {
  id: 89,
  item_id: 9,
  user_id: 87,
  rating: 4,
  date: '2015-09-21T18:30:00.000Z',
  verified: false,
  title: 'Ultra Durable',
  body: "I've had this phone for eons---at least 10 years, more like 12. My Nokia 1100 has been dropped many times where the back flies off and the battery flies out. It just keeps on working. No cracks or breaks. This thing has been dropped on cement more than once!! I just quit using it a week ago because I wasn't getting text messages sent from newer phones. It would come through as unreadable with the numbers 11001010 or something similar and I couldn't see who it was from either (if anyone knows how to remedy this, please tell me so I can go back to using this one!). This is my favorite phone. I also have a Samsung SGH-S425G and most recently added the Samsung Galaxy Stardust (all through Tracfone). The reason I like this Nokia 1100---I can text without ever looking at it because of the raised buttons. People with smart phones like to tell me that their phone has word prediction, which is when I get to tell them that this one does too! (Just gotta read the manual to see how to press the buttons once while spelling to get a list of suggested words). My smart phone takes me longer to do everything because it has too much stuff on it. With this one, I can make a call with 3 button presses, maybe 2. Not so on newer phones with more menus. If it weren't for needing to get text messages (work), I'd totally still be using this phone!!!!!",
  helpfulvotes: null,
  createdat: '2020-02-17T13:07:57.428Z',
  inactive: false,
  updatedat: '2020-02-17T13:07:57.428Z',
};
returnId = { id: 89 };

test('review.findById', () => {
  const mock = db.oneOrNone.mockReturnValue(reviewObj);
  const result = review.findById(2);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(reviewObj);
});

test('review.create', () => {
  const mock = db.one.mockReturnValue(returnId);
  const result = review.create(reviewObj);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(returnId);
});

test('review.edit', () => {
  const mock = db.oneOrNone.mockReturnValue(returnId);
  const result = review.edit(reviewObj);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(returnId);
});


test('review.remove', () => {
  const mock = db.oneOrNone.mockReturnValue(returnId);
  const result = review.remove(89);
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(result).toBe(returnId);
});

reviewlist = reviews.data;

db.manyOrNone.mockImplementation(() => reviewlist);
test('review.list', () => {
  const result = review.list(1, [true], '', 'reviews.id', true);
  expect(db.manyOrNone).toHaveBeenCalled();
  expect(db.manyOrNone).toHaveBeenCalledTimes(1);
  expect(result).toBe(reviewlist);
});
