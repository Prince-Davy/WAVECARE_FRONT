if (!process.env.CHROME_BIN && process.platform !== 'win32') {
  process.env.CHROME_BIN = '/usr/bin/chromium';
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
    ],
    client: {
      clearContext: false,
    },
    customLaunchers: {
        ChromeHeadlessCI: {
          base: 'ChromeHeadless',
          flags: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--disable-background-networking',
            '--disable-sync',
            '--disable-default-apps',
            '--disable-translate',
            '--disable-crash-reporter',
            '--disable-breakpad',
            '--no-first-run',
            '--no-zygote',
            '--remote-debugging-port=9222',
            '--window-size=1920,1080'
          ]
        }
      },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' },
        { type: 'json-summary' },
      ],
      exclude: [
        'src/app/api/generated/**',
        'src/app/api/model/**',
        'src/app/api/api/**',
        '**/src/app/api/generated/**',
        '**/src/app/api/model/**',
        '**/src/app/api/api/**',
      ],
      check: {
        global: {
          statements: 60,
          branches: 30,
          functions: 40,
          lines: 60,
        },
      },
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessCI'],
    singleRun: true,
    restartOnFileChange: false,
  });
};