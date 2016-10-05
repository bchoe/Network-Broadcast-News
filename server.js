//Load tcp library
const net = require('net');

//keep track of chat clients
let clients = [];

//start server
const server = net.createServer((request) => {
  //identify this client
  request.name = request.remoteAddress + ":" + request.remotePort;

  //send welcome message and announce to all
  request.write('Welcome!: ' + request.name + "\n");
  broadcast(request.name + " joined the chat");
  request.write("Please Type in name, then press ENTER to start Chat" + "\n");
  //console.log(request.name);

  //handle incoming messages from clients
  request.on('data',(data) => {

    newUser = data.toString();

    data = data.slice(0, data.length -1);

    if(request.name === request.remoteAddress + ":" + request.remotePort){

      request.name = data;

      console.log(newUser + ' has joined');


    } else {

      broadcast(request.name + ": " + data, request);

    }

  });

  //removes client from tracker when they leave
  request.on('end', () => {
    console.log('Someone left the chatroom');
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
    process.stdout.write(message + '\n');
  }

  clients.push(request);
});

server.listen({port:6969, 'host': '0.0.0.0'}, () => {
  const address = server.address();
  console.log(`Opened server on ${address.port}`);
});

process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
    if(chunk !== null){
      clients.forEach(function(client){
        client.write('ADMIN: ' + chunk);

      });

    }
});

