const usernameField = document.getElementById('username');
const button = document.getElementById('button');

button.addEventListener('click', () => {
	let username = usernameField.value;

	if(username.length < 0) username = 'I somehowe messed up setting a username! LOL';

	document.cookie = `username=${username}`;

	window.location = '/chat';
});
