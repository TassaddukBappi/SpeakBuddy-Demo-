import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      axios.post('http://127.0.0.1:5000/api/tasks', { task: newTask })
        .then(response => setTasks(response.data.tasks))
        .catch(error => console.error(error));
      setNewTask('');
    }
  };

  const toggleCompletion = (taskId) => {
    axios.put(`http://127.0.0.1:5000/api/tasks/${taskId}`)
      .then(response => setTasks(response.data.tasks))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Task List</h1>
      <input
        type="text"
        placeholder="New task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={() => toggleCompletion(task.id)}
            >
              {task.task}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;