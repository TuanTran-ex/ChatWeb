const users = [];

function joinRoom(id, username, room) {
  const user = {id, username, room}
  users.push(user);
  return user;
}

function getUsersRoom(room) {
  const userRoom = users.filter(item => item.room === room);
  return userRoom;
}

function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = { joinRoom, getUsersRoom, userLeave };