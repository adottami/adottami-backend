export interface TokenOptions {
  subject: string;
  expiresIn: string;
}

interface TokenProvider {
  generate(options: TokenOptions): string;
  verify(token: string): string;
}

export default TokenProvider;
