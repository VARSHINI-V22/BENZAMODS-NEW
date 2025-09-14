// api/index.js
import serverless from 'serverless-http';
import app from './server.js';

// Wrap the Express app with serverless-http for Vercel
export const handler = serverless(app);