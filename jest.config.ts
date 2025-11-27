import type {Config} from 'jest';


export default async (): Promise<Config> => {
  return {
  preset: `ts-jest`,
  testEnvironment: "node",
  collectCoverage: true,
  testMatch: ['**/*.test.ts'],
  transform: { "^.+\\.(ts|tsx)$": ["ts-jest", {
     useESM: true,
    tsconfig: "tsconfig.test.json",
    }] },
  }
};

