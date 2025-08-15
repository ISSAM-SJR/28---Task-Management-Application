import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTasks(res.data));
  }, [token]);

  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id}>{task.title} - {task.status} - {task.deadline}</li>
      ))}
    </ul>
  );
};

export default TaskList;
