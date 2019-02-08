export default class FoxrError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, FoxrError);
    this.name = 'FoxrError';
  }

}