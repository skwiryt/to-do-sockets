const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [{id: 1, name: 'Shopping'}, {id:2, name: 'Go out with a dog'}];



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
    const index = tasks.findIndex(task => task.id === id);
    tasks.splice(index, 1);
    console.log('tasks: ', tasks);
    socket.broadcast.emit('removeTask', id);
  });
  socket.on('editTask', (task) => {
    const index = tasks.findIndex(t => task.id === t.id);
    tasks[index] = {id: task.id, name: task.name}
    console.log('tasks: ', tasks);
    socket.broadcast.emit('editTask', task);
  });

})