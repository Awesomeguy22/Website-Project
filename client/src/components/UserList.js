import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  getUsers,
  createUser,
  deleteUser,
  searchUsers,
  updateUser
} from '../api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    try {
      const newUser = { name, email };
      const res = await createUser(newUser);
      setUsers([...users, res.data]);
      setName('');
      setEmail('');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const details = err.response.data.details || [err.response.data.message];
        alert('Validation error:\n' + details.join('\n'));
      } else {
        console.error('Create user failed:', err);
        alert('Something went wrong while adding the user.');
      }
    }
    
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((u) => u._id !== id));
  };

  const handleSearch = async () => {
    const query = {};
    if (searchName) query.name = searchName;
    if (searchEmail) query.email = searchEmail;

    try {
      const res = await searchUsers(query);
      setUsers(res.data);
    } catch (err) {
      alert('Search failed');
      console.error(err);
    }
  };

  const handleReset = () => {
    setSearchName('');
    setSearchEmail('');
    fetchUsers();
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditName('');
    setEditEmail('');
  };

  const handleSaveEdit = async (id) => {
    try {
      const updatedUser = { name: editName, email: editEmail };
      const res = await updateUser(id, updatedUser);
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
      handleCancelEdit();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Joi validation error from backend
        const details = err.response.data.details || [err.response.data.message];
        alert('Validation error:\n' + details.join('\n'));
      } else {
        console.error('Failed to update user:', err);
        alert('Something went wrong while updating the user.');
      }
    }
  };
  

  return (
    <div>
      <h2>Users</h2>

      <h4>Add New User</h4>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleAdd}>Add User</button>

      <h4>Search Users</h4>
      <input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Search by name" />
      <input value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} placeholder="Search by email" />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleReset}>Reset</button>

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {editUserId === user._id ? (
              <>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                <button onClick={() => handleSaveEdit(user._id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {user.name} ({user.email})
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
