// Jest configuration for Next.js 15 App Router with TypeScript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  projects: [
    // Server/DAL tests (node environment)
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/src/shared/libs/dal/**/*.test.ts',
        '<rootDir>/src/shared/libs/session/**/*.test.ts'
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json',
        }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(@t3-oss/env-nextjs|@t3-oss/env-core)/)'
      ],
      collectCoverageFrom: [
        'src/shared/libs/session/**/*.ts',
        'src/shared/libs/dal/**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/__tests__/**',
        '!**/test*/**',
      ],
    },
    // Client component tests (jsdom environment)
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/components/**/*.test.tsx', '<rootDir>/tests/hooks/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json',
        }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}

export default createJestConfig(config)