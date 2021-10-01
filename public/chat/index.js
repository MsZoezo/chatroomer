const sendButton = document.getElementById('send-message');
const messageInput = document.getElementById('message');
const textArea = document.getElementById('text-area')

const socket = io();

sendButton.addEventListener('click', () => sendMessage());
messageInput.addEventListener('keypress', e => {
	if(e.key != 'Enter') return;

	sendMessage();
});

function sendMessage() {
	if(messageInput.value < 0) return;

	socket.emit('send-message', messageInput.value);

	messageInput.value = '';
}

socket.on('receive-message', data => {
	let username = data[0];
	let message = data[1];

	let messageDiv = document.createElement('div');
	let messageParagraph = document.createElement('p');
	
	messageDiv.classList.add('message');

	messageParagraph.innerHTML = `<b>${username}</b>: ${message}`;

	messageDiv.appendChild(messageParagraph);
	textArea.appendChild(messageDiv);

	textArea.scrollTo(0, textArea.scrollHeight);
});

socket.on('announcement', message => {
	let messageDiv = document.createElement('div');
	let messageParagraph = document.createElement('p');
	
	messageDiv.classList.add('message');

	messageParagraph.innerHTML = `<b>${message}</b>`;

	messageDiv.appendChild(messageParagraph);
	textArea.appendChild(messageDiv);

	textArea.scrollTo(0, textArea.scrollHeight);
});
