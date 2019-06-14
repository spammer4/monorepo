const config = require("../../jest.config");

 
// Remaps the root to the local src folder, as the root will run again packages

config.roots = ['src/'];

module.exports = config;