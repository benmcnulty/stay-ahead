module.exports = {
  testEnvironment: 'jsdom',
  roots: ['src'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.{js,ts}',
    '!src/**/*.d.ts',
    '!src/test-setup.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.js'],
  testMatch: [
    '<rootDir>/src/**/*.test.{js,ts}',
    '<rootDir>/tests/**/*.{js,ts}'
  ]
};
