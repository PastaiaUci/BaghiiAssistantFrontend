import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SideBar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? '<<' : '>>'}
      </button>
      {isOpen && (
        <div className="user-list">
          <h3>Users</h3>
          <ul>
            {users.map(user => (
              <li key={user._id}>{user.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
