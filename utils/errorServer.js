/* eslint-disable linebreak-style */
class ErrorServer extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
module.exports = ErrorServer;