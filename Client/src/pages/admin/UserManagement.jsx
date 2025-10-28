import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { fetchClients, fetchFreelancers } from "../../services/api";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [clients, freelancers] = await Promise.all([
          fetchClients(),
          fetchFreelancers()
        ]);

        // Combine clients and freelancers into users array
        const allUsers = [
          ...clients.map(client => ({
            id: client.id,
            name: client.name,
            email: client.email,
            role: "Client",
            status: "Active", // Assuming all are active for now
            lastActive: client.created_at ? new Date(client.created_at).toLocaleDateString() : "N/A",
            type: "client"
          })),
          ...freelancers.map(freelancer => ({
            id: freelancer.id,
            name: freelancer.name,
            email: freelancer.email,
            role: "Freelancer",
            status: "Active", // Assuming all are active for now
            lastActive: freelancer.created_at ? new Date(freelancer.created_at).toLocaleDateString() : "N/A",
            type: "freelancer"
          }))
        ];

        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "All" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = async (userId, userType) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:5555/api/${userType}s/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          alert("User deleted successfully!");
        } else {
          alert("Failed to delete user.");
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert("Error deleting user.");
      }
    }
  };

  const handleEditUser = (userId) => {
    // Find the user to edit
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      // In a real application, you would open a modal or navigate to an edit page
      alert(`Editing user: ${userToEdit.name}\nEmail: ${userToEdit.email}\nRole: ${userToEdit.role}\nStatus: ${userToEdit.status}`);
    }
  };

  const handleAddUser = () => {
    // In a real application, you would open a modal or navigate to an add user page
    alert("Add new user functionality would open here");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <Header />
          <div className="admin-content">
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="admin-content">
          <div className="user-management-header">
            <h2>User Management</h2>
            <button className="btn-add-user" onClick={handleAddUser}>+ Add New User</button>
          </div>

          <div className="user-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Client">Client</option>
                <option value="Freelancer">Freelancer</option>
              </select>

              <select
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{user.name.charAt(0)}</div>
                        <div className="user-name">{user.name}</div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastActive}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditUser(user.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user.id, user.type)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
