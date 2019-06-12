const config = require("../../jest.config");

config.roots = ['lib/'];
config.moduleNameMapper = {
  "^.+\\.(css|less)$": "<rootDir>/../common/styles/__mocks__/styleMock.js",
  "^@app(.*)$" : "<rootDir>/src$1",
  "^@common(.*)$" : "<rootDir>/../common/$1", 
},

module.exports = config;