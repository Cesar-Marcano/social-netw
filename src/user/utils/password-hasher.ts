import * as bcrypt from 'bcrypt';

import Password, { HASH_REGEX } from '../data-object/password.data-object';

/**
 * A utility class to handle password hashing and comparison using bcrypt.
 */
export default class PasswordHasher {
  /**
   * Compares a plain password with a hashed password to check if they match.
   *
   * @param password - The plain password to compare.
   * @param hash - The hashed password to compare against.
   * @returns A boolean indicating whether the password matches the hash.
   * @throws Error if the provided hash is not a valid hash format.
   */
  public static async compare(
    password: Password,
    hash: string,
  ): Promise<boolean> {
    // Check if the provided hash matches the expected hash format
    if (!HASH_REGEX.test(hash)) {
      throw new Error('The provided hash is not a hash.');
    }

    // Compare the plain password with the hashed password using bcrypt
    return bcrypt.compare(password.toString(), hash);
  }

  /**
   * Hashes a plain password using bcrypt with a specified number of rounds.
   *
   * @param password - The plain password to hash.
   * @returns A hashed version of the password.
   * @throws Error if the value of BCRYPT_ROUNDS in the environment is invalid.
   */
  public static async hash(password: Password): Promise<string> {
    // Parse the BCRYPT_ROUNDS from environment variables, defaulting to 10
    const bcryptRounds = parseInt(process.env['BCRYPT_ROUNDS'] ?? '10');

    // Ensure the BCRYPT_ROUNDS is a valid number
    if (isNaN(bcryptRounds)) {
      throw new Error(
        'Invalid value for BCRYPT_ROUNDS in the environment. Please ensure it is a valid number.',
      );
    }

    // Generate a salt with the specified number of bcrypt rounds
    const salt = await bcrypt.genSalt(bcryptRounds);

    // Hash the password with the generated salt
    return bcrypt.hash(password.toString(), salt);
  }
}
