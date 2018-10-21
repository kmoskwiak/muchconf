const { muchconf } = require('../../index');
const http = require('http');
const configStore = muchconf();

const config = configStore.get();

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(config.port, config.ip, () => {
  console.log(`Server running at http://${config.ip}:${config.port}/`);
});