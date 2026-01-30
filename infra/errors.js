export class InternalServerError extends Error {
  constructor({ cause }) {
    super("An unexpected InternalServerError occurred", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact suport";
    this.satusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.satusCode,
    };
  }
}
