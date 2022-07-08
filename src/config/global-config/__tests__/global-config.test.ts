import { GlobalConfig } from '../global-config';

describe('Global config', () => {
  const mode = 'test';
  const port = 5555;
  const allowedCORSOrigins = ['http://localhost:3000', 'http://localhost:3001'];

  it('should initialize correctly', () => {
    process.env.NODE_ENV = mode;
    process.env.PORT = port.toString();
    process.env.ALLOWED_CORS_ORIGINS = allowedCORSOrigins.join(',');

    const globalConfig = new GlobalConfig();
    expect(globalConfig.mode()).toBe(mode);
    expect(globalConfig.port()).toBe(port);
    expect(globalConfig.allowedCORSOrigins()).toEqual(allowedCORSOrigins);
  });

  describe('Cloudinary', () => {
    const cloudName = 'cloud-name';
    const apiKey = 'api-key';
    const apiSecret = 'api-secret';

    beforeEach(() => {
      process.env.CLOUDINARY_CLOUD_NAME = cloudName;
      process.env.CLOUDINARY_API_KEY = apiKey;
      process.env.CLOUDINARY_API_SECRET = apiSecret;
    });

    it('should load cloudinary config if present', () => {
      const globalConfig = new GlobalConfig();
      expect(globalConfig.cloudinary()).toEqual({ cloudName, apiKey, apiSecret });
    });

    it('should not load cloudinary config if not present', () => {
      delete process.env.CLOUDINARY_CLOUD_NAME;
      process.env.CLOUDINARY_API_KEY = apiKey;
      process.env.CLOUDINARY_API_SECRET = apiSecret;

      expect(new GlobalConfig().cloudinary()).toBe(null);

      process.env.CLOUDINARY_CLOUD_NAME = cloudName;
      delete process.env.CLOUDINARY_API_KEY;
      process.env.CLOUDINARY_API_SECRET = apiSecret;

      expect(new GlobalConfig().cloudinary()).toBe(null);

      process.env.CLOUDINARY_CLOUD_NAME = cloudName;
      process.env.CLOUDINARY_API_KEY = apiKey;
      delete process.env.CLOUDINARY_API_SECRET;

      expect(new GlobalConfig().cloudinary()).toBe(null);
    });
  });
});
