const withNextJsObfuscator = require('nextjs-obfuscator');

module.exports = withNextJsObfuscator(
  {
    // Obfuscator options
    compact: true,
    controlFlowFlattening: true,
  },
  {
    // Obfuscator plugin options
    enabled: 'detect', // Only obfuscate in production
    log: false,
  }
)({});
