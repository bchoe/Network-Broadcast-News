//Load tcp library
const net = require('net');

//keep track of chat clients
let clients = [];

//start server
const server = net.createServer((request) => {

  //identify this client
  request.name = request.remoteAddress + ":" + request.remotePort;

  //send welcome message and announce to all
  request.write('Welcome ' + request.name + "\n");
  broadcast(request.name + " joined the chat", request.name);

  //handle incoming messages from clients
  request.on('data',(data) => {
  broadcast(request.name + ": " + data, request);
    console.log(data.toString());
  });

  //removes client from tracker when they leave
  request.on('end', () => {
    console.log('connection closed');
    let selected = (clients.indexOf(request));
    clients.splice(selected, 1);

  });

  //send a message to all clients
  function broadcast(message, sender){
    clients.forEach(function(client){
      if(client === sender) {
        return;
      } else {
        client.write(message);
      }

    });

    //log it to the server output
    process.stdout.write(message);
  }
  clients.push(request);
});

server.listen({port:6969}, () => {
  const address = server.address();
  console.log(`Opened server on ${address.port}`);
});