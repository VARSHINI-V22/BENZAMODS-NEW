// api/index.js
import server from '../server.js';

export default async function handler(req, res) {
  return server(req, res);
}