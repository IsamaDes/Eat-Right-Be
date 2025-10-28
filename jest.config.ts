import type {Config} from 'jest';


export default async (): Promise<Config> => {
  return {
  preset: `ts-jest`,
  testEnvironment: "node",
  testMatch: ['**/*.test.ts'],
  transform: { "^.+\\.(ts|tsx)$": ["ts-jest", {
     useESM: true,
    tsconfig: "tsconfig.test.json",
    }] },

  //    moduleNameMapper: {
  //   "^(\\.{1,2}/.*)\\.js$": "$1.ts", // map .js imports to .ts files
  // },
  }
  
};

