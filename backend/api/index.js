const serverless = require("serverless-http");
const app = require("../server"); // path to your server.js

module.exports = app;
module.exports.handler = serverless(app);
