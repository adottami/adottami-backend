import { GlobalConfig } from '../global-config';

describe('Global config', () => {
  it('should initialize correctly', () => {
    const globalConfig = new GlobalConfig();
    expect(globalConfig.mode()).toBe('test');
    expect(globalConfig.port()).toBe(3333);
  });
});
