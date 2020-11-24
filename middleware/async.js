// This utility function is to prevent the server from crashing when an error occurs or a badly formed request is made to
// the API.

// Async functions return promises. If everything goes without problems, the promise resolves and the callback
// function (a promise) runs. If an issue occurs, then the code inside catch is executed (next).

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
