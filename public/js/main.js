const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');

let {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', data => {
  $('#room-name').html(data.room);
  addRoomUsers(data.users);
})

socket.on('message', message => {
  // console.log(message);
  outputMessage(message);
  chatMessage.scrollTop = chatMessage.scrollHeight;
})

$(document).ready(function () {
  $('#chat-form').submit(function (e) { 
    e.preventDefault();
    
    // Get msg from the client
    const data ={
      msg: e.target.elements.msg.value,
      username: username
    } 
    // console.log(data);
    // Emit msg
    socket.emit('chatMessage', data);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.message}
  </p>`
  document.querySelector('.chat-messages').appendChild(div);
}

function addRoomUsers(users) {
  $('#users').html('');
  users.forEach(element => {
    $('#users').append(`<li>${element.username}</li>`);
  });
}
