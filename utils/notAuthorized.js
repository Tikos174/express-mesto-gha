/* eslint-disable linebreak-style */
class NotАuthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = NotАuthorized;
