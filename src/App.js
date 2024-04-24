import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsBackspace } from 'react-icons/bs';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, description: 'Task 1', completed: true },
    { id: 2, description: 'Task 2', completed: false },
    { id: 3, description: 'Task 3', completed: false }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get('/api/tasks').then(response => setTasks(response.data));
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && input.trim()) {
      addTask();
    }
  };

  const addTask = () => {
    axios.post('/api/task', { description: input }).then(response => {
      setTasks([...tasks, response.data]);
      setInput('');
    });
  };


  const toggleTask = (id) => {
    axios.put(`/api/task/${id}`)
      .then(response => {
        setTasks(tasks.map(task => task.id === id ? response.data : task));
      })
      .catch(error => {
        console.error('Failed to update task:', error);
        setTasks(tasks);
      });
    };

  const deleteTask = (id) => {
    axios.delete(`/api/task/${id}`).then(() => {
      setTasks(tasks.filter(task => task.id !== id));
    });
  };

  const deleteCompletedTasks = () => {
    axios.delete('/api/tasks/completed').then(() => {
      setTasks(tasks.filter(task => !task.completed));
    });
  };
  
  const completedCount = tasks.filter(task => task.completed).length;

  const pendingTasksCount = tasks.length - completedCount;

  return (
    <div className="app">
      <h3>What do you want to do today?</h3>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="buy milk" onKeyDown={handleKeyDown}/>
      {tasks.map(task => (
        <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
          <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
          {task.description}
          <BsBackspace className="delete-task-icon" onClick={() => deleteTask(task.id)} />
        </div>
      ))}
      <div className="footer">
        <span className="task-left"><span className="tasks-count">{pendingTasksCount}</span> tasks left</span>
        { completedCount > 0 && 
          (
          <span className="clear-completed" onClick={deleteCompletedTasks}>Clear {completedCount} completed tasks</span>
          ) 
        }
      </div>
    </div>
  );
};

export default App;