/* eslint-disable linebreak-style */
class ConflictEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictEmail;
