const serverless = require("serverless-http");
const app = require("../server"); // path to server.js

module.exports = serverless(app); // export only the handler
