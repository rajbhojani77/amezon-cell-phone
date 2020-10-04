const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/user');
require('dotenv').config();

module.exports = (passport) => {
  passport.use(new JwtStrategy({
    jwtFromRequest: (req) => req.cookies.jwt,
    secretOrKey: process.env.SECRET_KEY,
  }, (JWT_PAYLOAD, done) => {
    User.findById(JWT_PAYLOAD.id, (err, user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  }));
};
