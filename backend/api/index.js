import serverless from 'serverless-http';
import app from '../server.js';

console.log('Loading serverless function...');
console.log('Environment variables check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- MONGO_URI:', process.env.MONGO_URI ? '***' : 'MISSING');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '***' : 'MISSING');

export const handler = serverless(app);