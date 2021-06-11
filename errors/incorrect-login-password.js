class IncorrectLoginPassword extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = IncorrectLoginPassword;
