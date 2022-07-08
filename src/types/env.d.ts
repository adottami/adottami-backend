declare namespace NodeJS {
  type Mode = import('@/config/global-config/types').Mode;

  interface ProcessEnv {
    readonly NODE_ENV?: Mode;
    readonly PORT: string;
    readonly ALLOWED_CORS_ORIGINS?: string;

    readonly CLOUDINARY_CLOUD_NAME?: string;
    readonly CLOUDINARY_API_KEY?: string;
    readonly CLOUDINARY_API_SECRET?: string;
  }
}
