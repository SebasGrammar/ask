const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log(token);
  console.log(req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];

    console.log('WIIIIIIII');
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure that the token exists
  if (!token) {
    // return next(new ErrorResponse('Not authorized to access this route.', 401));
  }
  // console.log('tone');
  // console.log(token);
  // console.log(process.env.JWT_SECRET_KEY);

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log('1');
  console.log(decoded);

  // req.user = await User.findById(decoded.id);
  console.log('IASIDAISODJ');

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('1');
    console.log(decoded);

    req.user = await User.findById(decoded.id);
    console.log('IASIDAISODJ');
    next();
  } catch (error) {
    // return next(new ErrorResponse('Not authorized to access this route.', 401));
    console.log('DAMN');
  }
});

// Grant access to specific roles

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      //   return next(
      //     new ErrorResponse(
      //       `User role ${req.user.role} is unauthorized to access this route.`,
      //       403
      //     )
      //   );
    }
    next();
  };
};
