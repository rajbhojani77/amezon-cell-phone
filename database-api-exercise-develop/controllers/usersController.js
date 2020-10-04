const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = {
  // REGISTER A NEW USER
  newUser(req, res, next) {
    const { username, password } = req.body;

    const newUser = { username, password };

    // USE MODEL TO REGISTER A NEW USER
    User.addUser(newUser)
      .then((user) => {
        res.status(201).json({
          success: true,
          message: 'User registered',
          data: { id: user.id },
        });
      })
      .catch((err) => next(err));
  },

  // PROFILE
  fetchProfile(req, res) {
    res.status(200).json({
      success: true,
      message: 'User Information',
      data: req.user,
    });
  },

  // REVIEWER LIST
  reviewersList(req, res, next) {
    const PAGE_NO = req.query.page_no || 1;
    const orderby = req.query.orderby || 'users.id';
    const order = req.query.order || true;

    User.list(PAGE_NO, orderby, order)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Reviewers fetched',
          data: result,
        });
      })
      .catch((err) => next(err));
  },

  // GET REVIEWER
  reviewer(req, res, next) {
    const { id } = req.params;
    User.findById(id, (err, user) => {
      if (user == null) { throw new Error('Id Not Found'); }
      res.status(200).json({
        success: true,
        message: 'Reviewer fetched',
        data: user,
      });
    }).catch((err) => next(err));
  },

  // EDIT REVIEWER
  editReviewer(req, res, next) {
    req.body.id = req.params.id;
    const reviewer = req.body;

    User.edit(reviewer)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Reviewer Updated',
          data: { id: result.id },
        });
      })
      .catch((err) => next(err));
  },

  // DELETE REVIEWER
  deleteReviewer(req, res, next) {
    const { id } = req.params;

    User.remove(id)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: 'Reviewer Deleted',
          data: { id: result.id },
        });
      })
      .catch((err) => next(err));
  },

  // LOG IN
  LogIn(req, res) {
    const { username, password } = req.body;

    // eslint-disable-next-line consistent-return
    User.findByUserName(username).then((user) => {
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // eslint-disable-next-line consistent-return
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (isMatch) {
          const token = jwt.sign({ id: user.id, username: user.username, role_id: user.role_id },
            process.env.SECRET_KEY, {
              expiresIn: 604800, // 1 WEEK
            });

          res.cookie('jwt', token, { httpOnly: true, secure: false });
          res.status(200).json({
            success: true,
            token: `JWT ${token}`,
            data: {
              username: user.username,
            },
          });
        } else {
          return res.status(401).json({ success: false, message: 'Wrong password' });
        }
      });
    });
  },
  Logout(req, res) {
    res.clearCookie('jwt');
    res.status(200).json({ success: true, message: 'successfully logged out' });
  },
};
