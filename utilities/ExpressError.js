class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCod;
  }
}

module.exports = ExpressError;
