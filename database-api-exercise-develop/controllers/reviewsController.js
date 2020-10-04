const Reviews = require('../models/reviews');

module.exports = {

  // GET Reviews
  reviewsList(req, res, next) {
    const PAGE_NO = req.query.page_no || 1;
    const isVerified = (req.query.isVerified) ? [req.query.isVerified] : [true, false];
    const body = req.query.text || '';
    const orderby = req.query.orderby || 'reviews.id';
    const order = req.query.order || true;

    Reviews.list(PAGE_NO, isVerified, body, orderby, order)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: 'Reviews fetched',
          data: result,
        });
      })
      .catch((err) => next(err));
  },

  // REGISTER A NEW Reviews
  newReview(req, res, next) {
    const newReviews = req.body;

    Reviews.create(newReviews)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Reviews added',
          data: { id: result.id },
        });
      })
      .catch((err) => next(err));
  },

  // GET Review
  getReview(req, res, next) {
    const { id } = req.params;
    Reviews.findById(id)
      .then((result) => {
        if (result == null) { throw new Error('Id Not Found'); }
        res.status(200).json({
          success: true,
          message: 'Review fetched',
          data: result,
        });
      })
      .catch((err) => next(err));
  },

  // EDIT Review
  editReview(req, res, next) {
    req.body.id = req.params.id;
    const newReviews = req.body;

    Reviews.edit(newReviews)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Review Updated',
          data: { id: result.id },
        });
      })
      .catch((err) => next(err));
  },

  // DELETE Review
  deleteReview(req, res, next) {
    const { id } = req.params;

    Reviews.remove(id)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Review Deleted',
          data: { id: result.id },
        });
      })
      .catch((err) => next(err));
  },

};
