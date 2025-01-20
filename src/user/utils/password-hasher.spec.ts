import PasswordHasher from './password-hasher';

describe('PasswordHasher', () => {
  let password: string;
  let hashedPassword: string;

  beforeAll(async () => {
    password = 'mySecurePassword';
    hashedPassword = await PasswordHasher.hash(password);
  });

  it('should return a different hash than the original password', async () => {
    expect(password).not.toBe(hashedPassword);
  });

  it('should return true when comparing the password with its hash', async () => {
    const result = await PasswordHasher.compare(password, hashedPassword);
    expect(result).toBe(true);
  });

  it('should return false when comparing an incorrect password with its hash', async () => {
    const incorrectPassword = 'wrongPassword';
    const result = await PasswordHasher.compare(
      incorrectPassword,
      hashedPassword,
    );
    expect(result).toBe(false);
  });
});
