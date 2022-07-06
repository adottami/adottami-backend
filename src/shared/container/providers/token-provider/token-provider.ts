export interface TokenOptions {
  subject?: string;
  expiresIn?: string;
}

export interface TokenProvider {
  generate(options: TokenOptions): string;
}
