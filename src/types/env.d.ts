declare namespace NodeJS {
  type Mode = import('@/config/global-config/types').Mode;

  interface ProcessEnv {
    readonly NODE_ENV?: Mode;
    readonly PORT: string;
  }
}
