import { compare, hash } from 'bcrypt';

import HashProvider from '../../hash-provider';

class BcryptHashProvider implements HashProvider {
  public readonly saltOrRounds: string | number = 8;

  async generate(payload: string): Promise<string> {
    const generatedHash = await hash(payload, this.saltOrRounds);

    return generatedHash;
  }

  async compare(payload: string, hash: string): Promise<boolean> {
    const result = compare(payload, hash);

    return result;
  }
}

export default BcryptHashProvider;
