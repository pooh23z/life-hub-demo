// Vercel Serverless Function: /api/line-webhook.js
// Proxies directly to /api/send-line.js for handling LINE Webhook events
module.exports = require('./send-line.js');
