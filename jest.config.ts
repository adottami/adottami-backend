import swcConfig from './.swcrc.json';

export default {
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.ts'],
  clearMocks: true,

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
  testPathIgnorePatterns: ['node_modules', 'public', '.next'],

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
