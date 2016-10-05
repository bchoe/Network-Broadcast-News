const net = require('net');

const options = {
  'port': 6969,
  'host': '0.0.0.0'
};

const client = net.connect(options, () => {
  console.log('connected to server');
  client.write('hello server');
});

client.on('data', (data) => {
  console.log(data.toString());
});

process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  if(chunk !== null){
    client.write(chunk);
  }
});