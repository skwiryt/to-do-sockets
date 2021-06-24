import { io } from 'socket.io-client';
import React from 'react';

class App extends React.Component {
  state = { 
    tasks: [],
    taskName: '',
   };
  setTaskName = (name) => {
    this.setState({...this.state, taskName: name})
  }
  setTasks = (tasks) => {
    this.setState({...this.state, tasks});
  }
  componentDidMount = () => {
    console.log('component did mount');
    this.socket = io('http://localhost:8000');
    this.socket.on('updateData', (tasks) => this.setTasks(tasks));
    this.socket.on('addTask', (task) => this.addTask(task));
  };

  removeTask = (i) => {  
    let tasks = [...this.state.tasks];
    tasks.splice(i, 1);
    this.setState({...this.state, tasks});    
  }
  addTask = (task) => {
    let tasks = [...this.state.tasks];
    tasks.push(task);
    this.setState({...this.state, tasks }, () => this.setTaskName(''));
  }
  sendRemoveTask = (i) => {
    this.removeTask(i);
    this.socket.emit('removeTask', {id: i})
  } 
  sendAddTask = (e) => {
    e.preventDefault();
    const task = this.state.taskName;
    this.addTask(task)
    
    this.socket.emit('addTask', task);
      
  }
  
  render = () => {
    return (
      <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {
          this.state.tasks.map((task, i) => (
            <li key={i} class="task">{task} <button onClick={() => this.sendRemoveTask(i)} class="btn btn--red">Remove</button></li>
          ))
          }          
        </ul>
        <form id="add-task-form">
          <input name="task" onChange={(e) => this.setTaskName(e.target.value)} className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={this.state.taskName} />
          <button onClick={(e) => this.sendAddTask(e)} className="btn" type="submit">Add</button>
        </form>
      </section>
    </div>
    );
  }  
};

export default App;
