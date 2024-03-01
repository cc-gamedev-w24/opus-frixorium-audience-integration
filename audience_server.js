const WebSocket = require('ws');
const PORT = process.env.PORT || 3000
const wss = new WebSocket.Server({ port:PORT });

// Routes and middleware

wss.on('connection', function connection(ws, req) {
	const ip = req.connection.remoteAddress;

	console.log(`Client connected from IP: ${ip}}`);
	
	ws.on('error', (error) => {
		console.log(`WebSocket error from IP: ${ip}:`, error);
	});

	ws.on('message', (message) => {
		if(message == 'Unity') {
			// Handle setting up game
			console.log(`Unity client connected`);
		} else {
			// Handle connecting client
			console.log('Audience client connected');
		}
	});

	ws.on('close', () => {
		console.log(`Client from IP: ${ip} disconnected`);
	});
});

console.log(`Server is running on port: ${PORT}`);