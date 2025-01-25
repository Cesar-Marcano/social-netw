import * as bcrypt from 'bcrypt';

import Password, { HASH_REGEX } from '../data-object/password.data-object';

export default class PasswordHasher {
  public static async compare(
    password: Password,
    hash: string,
  ): Promise<boolean> {
    if (!HASH_REGEX.test(hash)) {
      throw new Error('The provided hash is not a hash.');
    }

    return bcrypt.compare(password.toString(), hash);
  }

  public static async hash(password: Password): Promise<string> {
    const bcryptRounds = parseInt(process.env['BCRYPT_ROUNDS'] ?? '10');

    if (isNaN(bcryptRounds)) {
      throw new Error(
        'Invalid value for BCRYPT_ROUNDS in the environment. Please ensure it is a valid number.',
      );
    }

    const salt = await bcrypt.genSalt(bcryptRounds);

    return bcrypt.hash(password.toString(), salt);
  }
}
