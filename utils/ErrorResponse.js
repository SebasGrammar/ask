// This class uses the Error class message attribute and includes a status code to inform of the
// status of the request made to the API.

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
