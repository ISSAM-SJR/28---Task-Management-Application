import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(tasks.filter(t => t._id !== id));
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline?.split('T')[0] || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`/api/tasks/${editingTaskId}`, editForm, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditingTaskId(null);
    fetchTasks();
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {editingTaskId === task._id ? (
              <form onSubmit={handleUpdate}>
                <input
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description"
                />
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={e => setEditForm({ ...editForm, deadline: e.target.value })}
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <strong>{task.title}</strong> - {task.status} - {task.deadline?.split('T')[0]}
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
