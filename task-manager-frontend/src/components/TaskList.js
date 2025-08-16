import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', deadline: '' });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchFilteredTasks();
  }, [search, status, sortBy]);

  const fetchFilteredTasks = async () => {
    try {
      const res = await axios.get('https://your-backend.onrender.com/api/tasks/search', {
  headers: { Authorization: `Bearer ${token}` },
  params: { title: search, status, sortBy }
});

      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://your-backend.onrender.com/api/tasks/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
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
    try {
      await axios.put(`https://your-backend.onrender.com/api/tasks/${editingTaskId}`, editForm, {
  headers: { Authorization: `Bearer ${token}` }
});

      setEditingTaskId(null);
      fetchFilteredTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div>
      <h2>Your Tasks</h2>

      {/* 🔍 Filter Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Search by title"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="in progress">In Progress</option>
          <option value="pending">Pending</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* 📋 Task List */}
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
                <button type="button" onClick={() => setEditingTaskId(null)}>Cancel</button>
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
