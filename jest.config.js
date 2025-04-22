module.exports = {
  testEnvironment: 'node', // Mặc định cho backend
  testMatch: [
    '<rootDir>/tests/backend/**/*.test.js',
    '<rootDir>/tests/frontend/**/*.test.js'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js']
};