import HashProvider from '../hash-provider';

class HashProviderMock implements HashProvider {
  public readonly type: BufferEncoding = 'base64';
  public readonly encoding: BufferEncoding = 'utf8';

  async generate(payload: string): Promise<string> {
    const generatedHash = Buffer.from(payload, this.encoding).toString(this.type);

    return generatedHash;
  }

  async compare(payload: string, hash: string): Promise<boolean> {
    const result = payload === Buffer.from(hash, this.type).toString(this.encoding);

    return result;
  }
}

export default HashProviderMock;
