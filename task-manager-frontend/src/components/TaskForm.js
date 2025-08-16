import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ token }) => {
  const [task, setTask] = useState({ title: '', description: '', deadline: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('https://your-backend.onrender.com/api/tasks', task, {
  headers: { Authorization: `Bearer ${token}` }
});

  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" onChange={e => setTask({ ...task, title: e.target.value })} />
      <input placeholder="Description" onChange={e => setTask({ ...task, description: e.target.value })} />
      <input type="date" onChange={e => setTask({ ...task, deadline: e.target.value })} />
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
