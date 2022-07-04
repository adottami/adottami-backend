import HashProvider from '../../../hash-provider';
import BcryptHashProvider from '../bcrypt-hash-provider';

describe('Bcrypt hash provider', () => {
  let hashProvider: HashProvider;
  const text = 'test123';

  beforeEach(() => {
    hashProvider = new BcryptHashProvider();
  });

  it('should be able to create hash for text', async () => {
    const textHash = await hashProvider.generate(text);

    expect(textHash).not.toBeNaN();
    expect(textHash).not.toBeNull();
    expect(textHash).not.toBeUndefined();
    expect(textHash).not.toBe('');
    expect(textHash.length).toBeGreaterThanOrEqual(1);
  });

  it('should be able to create hash for text with hash different from text', async () => {
    const textHash = await hashProvider.generate(text);

    expect(textHash).not.toBe(text);
  });

  it('should be able to compare the hash with the text', async () => {
    const textHash = await hashProvider.generate(text);

    const resultCompare = await hashProvider.compare(text, textHash);

    expect(resultCompare).not.toBeNaN();
    expect(resultCompare).not.toBeNull();
    expect(resultCompare).not.toBeUndefined();
    expect(`${resultCompare}`).toMatch(/[true|false]/);
  });

  it('should be able to compare the hash to the text and return true if the hash is valid', async () => {
    const textHash = await hashProvider.generate(text);

    const resultCompare = await hashProvider.compare(text, textHash);

    expect(resultCompare).toBeTruthy();
  });

  it('should be able to compare the hash to the text and return false if the hash is invalid', async () => {
    const textHash = await hashProvider.generate(text);

    const resultCompare = await hashProvider.compare(`${text}456`, textHash);

    expect(resultCompare).toBeFalsy();
  });
});
