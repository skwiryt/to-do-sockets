const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = ['Shopping', 'Go out with a dog'];



app.use((req, res) => {
  res.status(404).send('Not found');
});

const server = app.listen(8000, () => console.log('Server started on port 8000'));
const io = socket(server, {
  cors: {
    origin: '*',
  }
});
io.on('connection', (socket) => {
  console.log('Server estabilished socked id: ' + socket.id);
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
    console.log('tasks: ', tasks);
  });
  socket.on('removeTask', (id) => {
    tasks.splice(id, 1);
    socket.broadcast.emit('removeTask', id);
  });

})