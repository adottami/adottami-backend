declare namespace NodeJS {
  type Mode = import('@/config/global-config/types').Mode;

  interface ProcessEnv {
    NODE_ENV?: Mode;
    PORT: string;
    ALLOWED_CORS_ORIGINS?: string;

    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;

    JWT_SECRET: string;
  }
}
