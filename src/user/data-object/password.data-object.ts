// Regular expression to check for bcrypt hash format (bcrypt hashes start with "$2a$", "$2b$", or "$2y$")
export const HASH_REGEX = /^\$2[aby]\$/;

// Error messages for password validation
const ERRORS = {
  LENGTH: 'Password length must be greater than 8 characters.',
  IS_HASH:
    'The password provided is invalid because it resembles a bcrypt hash.',
};

export default class Password {
  private readonly password: string;

  /**
   * Constructs a Password instance.
   *
   * Validates the provided password to ensure it's:
   * - At least 8 characters long.
   * - Not already a bcrypt hash.
   *
   * @param password - The password string to be validated.
   * @throws Error if the password is too short or resembles a bcrypt hash.
   */
  constructor(password: string) {
    // Trim whitespace from the provided password
    const trimmedPassword = password.trim();

    // Validate the password's length
    this.validateLength(trimmedPassword);

    // Validate that the password is not a bcrypt hash
    this.validateNotHash(trimmedPassword);

    // Store the validated password
    this.password = trimmedPassword;
  }

  /**
   * Returns the password as a string.
   *
   * @returns The password string.
   */
  public toString() {
    return this.password;
  }

  /**
   * Validates the length of the password.
   * The password must be at least 8 characters long.
   *
   * @param password - The password string to validate.
   * @throws Error if the password length is less than 8 characters.
   */
  private validateLength(password: string): void {
    if (password.length < 8) {
      throw new Error(ERRORS.LENGTH);
    }
  }

  /**
   * Validates that the password is not already a bcrypt hash.
   *
   * @param password - The password string to validate.
   * @throws Error if the password resembles a bcrypt hash (matches the HASH_REGEX pattern).
   */
  private validateNotHash(password: string): void {
    if (HASH_REGEX.test(password)) {
      throw new Error(ERRORS.IS_HASH);
    }
  }
}
