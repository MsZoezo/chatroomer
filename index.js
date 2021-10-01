const { Server } = require('socket.io');
const express = require('express');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();

let shouldUseHttps = false;
if(process.argv.find(arg => arg == 'https')) shouldUseHttps = true;

let server,port;

if(shouldUseHttps) {
	const options = {
		key: fs.readFileSync('/etc/letsencrypt/live/zoezo.wtf/privkey.pem'),
		cert: fs.readFileSync('/etc/letsencrypt/live/zoezo.wtf/fullchain.pem')
	}

	server = https.createServer(options, app);
	port = 443;
}
else {
	server = http.createServer(app);
	port = 8000;
}

const io = new Server(server);

app.use(cookieParser())

app.get('/', (req, res, next) => res.sendFile('login/index.html', {root: __dirname + '/public'}));

app.get('/chat', (req, res, next) => {
	if(req.cookies.username == undefined) res.redirect('../');

	res.sendFile('chat/index.html', {root: __dirname + '/public'});
});

app.use(express.static('./public'));

io.on('connection', socket => {
	let cookiesUnparsed = socket.handshake.headers.cookie;
	let cookies = cookie.parse(cookiesUnparsed);

	socket.username = cookies.username;
	console.log(`User '${socket.username}' [${socket.id}] connected!`);
	io.emit('announcement', `[!] ${socket.username} joined!`);

	socket.on('disconnect', () => {
		io.emit('announcement', `[!] ${socket.username} left!`);
		console.log(`User '${socket.username}' [${socket.id}] disconnected!`);
	});

	socket.on('send-message', message => {
		console.log(`${socket.username} [${socket.id}]: ${message}`);

		io.emit('receive-message', [socket.username, message]);
	});
});

server.listen(port);
