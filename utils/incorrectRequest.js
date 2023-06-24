/* eslint-disable linebreak-style */
class IncorrectRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
module.exports = IncorrectRequest;
