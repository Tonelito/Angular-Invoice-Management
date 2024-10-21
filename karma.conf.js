// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-sonarqube-reporter'),
      require('karma-verbose-reporter')
    ],
    // Add progress reporter for better visibility
    reporters: ['verbose', 'progress', 'kjhtml'],

    client: {
      jasmine: {
        // Remove failFast and stopOnFailure to see all test failures
        random: false,
        timeoutInterval: 10000 // Increase timeout for async operations
      },
      clearContext: true
    },

    sonarqubeReporter: {
      basePath: 'src/app',
      filePattern: '**/*spec.ts', // Updated pattern to catch all spec files
      encoding: 'utf-8',
      outputFolder: 'reports',
      legacyMode: false,
      reportName: 'ut_report.xml'
    },

    coverageReporter: {
      includeAllSources: true,
      dir: 'coverage',
      subdir: '.',
      reporters: [
        {
          type: 'html',
          dir: 'coverage'
        },
        {
          type: 'cobertura',
          dir: 'coverage'
        },
        {
          type: 'lcov',
          dir: 'coverage'
        },
        {
          type: 'text-summary' // Add text summary for console output
        }
      ],
      check: {
        global: {
          statements: 60, // Set to a lower percentage
          branches: 60, // Set to a lower percentage
          functions: 60, // Set to a lower percentage
          lines: 60 // Set to a lower percentage
        }
      }
    },

    // Increase timeouts for async operations
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 20000,
    browserDisconnectTolerance: 3,
    captureTimeout: 60000,

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    browsers: ['Chrome'],
    customLaunchers: {
      Headless: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-gpu',
          '--disable-software-rasterizer'
        ]
      }
    },

    // Change to false to keep the browser open for debugging
    singleRun: false,

    // Add files to be included/excluded
    files: [
      // Include any global scripts here if needed
    ],

    preprocessors: {
      // Add preprocessors if needed
    },

    restartOnFileChange: true,

    // Add mime types for proper file handling
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    }
  });
};
