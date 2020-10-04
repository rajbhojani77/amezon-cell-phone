const express = require('express');
const ReviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.get('/', ReviewsController.reviewsList);
router.post('/add', ReviewsController.newReview);
router.get('/:id(\\d+)', ReviewsController.getReview);

router.use('/', (req, res, next) => {
  if (req.user.role_id === 1) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Required Admin Permission',
    });
  }
});

router.put('/:id(\\d+)/edit', ReviewsController.editReview);
router.delete('/:id(\\d+)/delete', ReviewsController.deleteReview);

module.exports = router;
