const express = require('express');
const passport = require('passport');
const UsersController = require('../controllers/usersController');
const ValidateUser = require('../services/validateUser');

const router = express.Router();

router.post('/login', ValidateUser.test, UsersController.LogIn);
router.get('/logout', UsersController.Logout);
router.get('/profile', passport.authenticate('jwt', { session: false }), UsersController.fetchProfile);
router.post('/add', ValidateUser.test, UsersController.newUser);

router.use('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (req.user.role_id === 1) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Required Admin Permission',
    });
  }
});

router.get('/', UsersController.reviewersList);
router.get('/:id(\\d+)', UsersController.reviewer);
router.put('/:id(\\d+)/edit', UsersController.editReviewer);
router.delete('/:id(\\d+)/delete', UsersController.deleteReviewer);

module.exports = router;
