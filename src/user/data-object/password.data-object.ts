export const HASH_REGEX = /^\$2[aby]\$/;

const ERRORS = {
  LENGTH: 'Password length must be greater than 8 characters.',
  IS_HASH:
    'The password provided is invalid because it resembles a bcrypt hash.',
};

export default class Password {
  private readonly password: string;

  constructor(password: string) {
    const trimmedPassword = password.trim();

    this.validateLength(trimmedPassword);
    this.validateNotHash(trimmedPassword);

    this.password = trimmedPassword;
  }

  public toString() {
    return this.password;
  }

  private validateLength(password: string): void {
    if (password.length < 8) {
      throw new Error(ERRORS.LENGTH);
    }
  }

  private validateNotHash(password: string): void {
    if (HASH_REGEX.test(password)) {
      throw new Error(ERRORS.IS_HASH);
    }
  }
}
