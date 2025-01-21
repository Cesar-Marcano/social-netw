import Password from '../data-object/password.data-object';
import PasswordHasher from './password-hasher';

describe('PasswordHasher', () => {
  let password: string;
  let hashedPassword: string;

  beforeAll(async () => {
    password = 'mySecurePassword';
    hashedPassword = await PasswordHasher.hash(new Password(password));
  });

  it('should return a different hash than the original password', async () => {
    expect(password).not.toBe(hashedPassword);
  });

  it('should return true when comparing the password with its hash', async () => {
    const result = await PasswordHasher.compare(new Password(password), hashedPassword);
    expect(result).toBe(true);
  });

  it('should return false when comparing an incorrect password with its hash', async () => {
    const incorrectPassword = 'wrongPassword';
    const result = await PasswordHasher.compare(
      new Password(incorrectPassword),
      hashedPassword,
    );
    expect(result).toBe(false);
  });
});
