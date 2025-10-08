import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: 'src/**/*.test.ts',
  nodeResolve: true,
  
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'es2020',
      loaders: {
        '.ts': 'ts'
      },
      tsconfig: './tsconfig.json'
    })
  ],

  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' })
  ],

  testFramework: {
    config: {
      timeout: 10000,
      retries: 0
    }
  },

  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
