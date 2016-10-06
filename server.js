//Load tcp library
const net = require('net');

//keep track of chat users
let users = [];

//start server
const server = net.createServer((request) => {
  //identify this client
  request.name = request.remoteAddress + ":" + request.remotePort;

  //send welcome message and announce to all
  request.write('Welcome!: ' + request.name + "\n");
  broadcast(request.name + " joined the chat");
  request.write("Please Type in name, then press ENTER to start Chat" + "\n");
  //console.log(request.name);

  //handle incoming messages from users
  request.on('data',(data) => {

    data.toString();

    data = data.slice(0, data.length -1);

    if(request.name === request.remoteAddress + ":" + request.remotePort){

      request.name = data;

      console.log(data.toString() + ' has joined');

    } else {

      broadcast(request.name + ": " + data, request);

    }

  });

  //removes client from tracker when they leave
  request.on('end', () => {
    console.log('Left the chatroom');
    let selected = (users.indexOf(request));
    users.splice(selected, 1);

  });

  //send a message to all users
  function broadcast(message, sender){
    users.forEach(function(client){
      if(client === sender) {
        return;
      } else {
        client.write(message);
      }

    });

    //log it to the server output
    process.stdout.write(message + '\n');
  }
  users.push(request);
});

server.listen({port:6969, 'host': '0.0.0.0'}, () => {
  const address = server.address();
  console.log(`Opened server on ${address.port}`);
});

process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
    if(chunk !== null){
      users.forEach(function(client){
        client.write('ADMIN: ' + chunk);

      });

    }
});

