const serverless = require("serverless-http");
const app = require("../server");

module.exports = app;
module.exports.handler = serverless(app);
