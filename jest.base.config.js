module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    "<rootDir>/setup-jest.ts"
  ],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: './projects/angular-sdk/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
};
