import {WebSocket} from 'ws'

const socket = new WebSocket('ws://localhost:3000'); // Change to your server URL

socket.on('open', () => {
  console.log('✅ Connected to server');

  // Send a test message
  socket.send(JSON.stringify({
    type:
      'ping'
  }));
  socket.send(JSON.stringify({type: 'ping'}));
  socket.send(JSON.stringify({type: 'ping'}));
  socket.send("  ");
  socket.send(Buffer.from([1, 2, 255, 3, 5]));
  socket.send(Buffer.from([1, 2, 44, 3, 5]));
  socket.send(Buffer.from([1, 2, 251, 3, 5]));
  socket.send(Buffer.from([1, 4, 251, 3, 5]));

  // Optional: send more messages after a delay
  setTimeout(() => {
    socket.send(JSON.stringify({type: 'chat', content: 'Hello from Node client!'}));
  }, 1000);
});


socket.on('ping', (data) => {
  console.log('ping', data.toString());
})

socket.on('pong', (data) => {
  console.log('pong', data.toString());
})

socket.on('message', (data, isBinary) => {
  console.log('📨 Message from server:', data.toString(isBinary ? 'hex' : 'utf8'));
});

socket.on('close', (code, reason) => {
  console.log('❌ Connection closed', {
    code,
    reason: reason.toString()
  });
});

socket.on('error', (err) => {
  console.error('⚠️ WebSocket error:', err.message);
});
