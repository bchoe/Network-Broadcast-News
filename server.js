const net = require('net');

const server = net.createServer((request) => {
  request.on('data',(data) => {
    console.log(data.toString());
  });

  request.write('hello client');
  request.on('end', () => {
    console.log('connection closed');
  });
});

server.listen({port:6969}, () => {
  const address = server.address();
  console.log(`Opened server on ${address.port}`);
});