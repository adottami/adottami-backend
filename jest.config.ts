import baseSWCConfig from './.swcrc.json';

const swcConfig = {
  ...baseSWCConfig,
  jsc: {
    ...baseSWCConfig.jsc,
    paths: {
      ...baseSWCConfig.jsc.paths,
      '@/*': ['src/*'],
    },
  },
};

export default {
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.ts'],
  clearMocks: true,
  testTimeout: 20000,

  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json', 'lcov'],
  collectCoverageFrom: [
    '<rootDir>/{src,test}/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules',
    '!*.{js,ts,json}',
    '!**/types/**/*.ts',
    '!**/types.ts',
    '!**/*.d.ts',
  ],

  testEnvironment: 'node',
  testRegex: '.*\\.test\\.ts$',
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/build'],

  transformIgnorePatterns: ['node_modules/.+\\.(ts|tsx)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@@/(.*)$': '<rootDir>/$1',
    '^@/([^\\.]*)$': '<rootDir>/src/$1',
    '^@tests/([^\\.]*)$': '<rootDir>/tests/$1',
  },

  transform: {
    '.*\\.(j|t)s$': ['@swc/jest', swcConfig],
  },

  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
