const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const formatMsg = require('./utils/message');
const users = require('./utils/users'); // Chứa data users

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Bot chat';

// User connect
io.on('connection', socket => {
  console.log('Client connect');
  socket.on('joinRoom', data => {
    // User join room
    const user = users.joinRoom(socket.id, data.username, data.room);
    socket.join(user.room);
    
    // Gui tin nhan tu bot chat
    socket.emit('message', formatMsg(botName, 'Welcome to chat'));
    socket.broadcast
    .to(user.room)
    .emit('message', formatMsg(botName, `${user.username} has join the chat`))
    
    // Gui thong tin room hien tai ve cho user
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: users.getUsersRoom(user.room)
    })
  }) 
  
  // Gui msg client khac ngoai tru client do nhan
  socket.broadcast.emit('message', formatMsg(botName, 'New client join'));

  // Listen khi co msg truyen tu client
  socket.on('chatMessage', data => {
    io.emit('message', formatMsg(data.username, data.msg));
  })

  // User disconnect
  socket.on('disconnect', () => {
    const user = users.userLeave(socket.id);

    if (user) {
      io.to(user.room)
      .emit('message', formatMsg(botName, `${user.username} has left the chat`));
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: users.getUsersRoom(user.room)
      })
    }
  })
})

server.listen(PORT, () => console.log(`Web listen on port ${PORT}`));