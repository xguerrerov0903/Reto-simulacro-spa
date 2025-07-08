// server.js
const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors()); // ✅ Habilita CORS
server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000');
});
