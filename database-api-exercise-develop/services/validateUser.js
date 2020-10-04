const Validate = {};

Validate.test = (req, res, next) => {
  // EXTRACT FORM DATA
  const { username, password } = req.body;

  // CHECK IF USERNAME IS VALID (NOT EMPTY)
  if (!username) {
    return res.status(422).json({
      success: false,
      message: 'Username is required',
    });
  }

  // CHECK IF PASSWORD IS VALID (NOT EMPTY)
  if (!password) {
    return res.status(422).json({
      success: false,
      message: 'Password is required',
    });
  }

  return next();
};

module.exports = Validate;
