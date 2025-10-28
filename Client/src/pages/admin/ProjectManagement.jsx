import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { fetchTasks, fetchContracts } from "../../services/api";
import "./UserManagement.css"; // Reuse the same CSS

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [tasks, contracts] = await Promise.all([
          fetchTasks(),
          fetchContracts()
        ]);

        // Combine tasks with contract information
        const projectsWithStatus = tasks.map(task => {
          const contract = contracts.find(c => c.task_id === task.id);
          let status = "Open";
          if (contract) {
            status = contract.status || "In Progress";
          }

          return {
            id: task.id,
            title: task.title,
            description: task.description,
            budget: task.budget,
            deadline: task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A",
            status: status,
            client: task.client?.name || "Unknown",
            skills: task.skills || []
          };
        });

        setProjects(projectsWithStatus);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`http://localhost:5555/api/tasks/${projectId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProjects(projects.filter(project => project.id !== projectId));
          alert("Project deleted successfully!");
        } else {
          alert("Failed to delete project.");
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert("Error deleting project.");
      }
    }
  };

  const handleEditProject = (projectId) => {
    const projectToEdit = projects.find(project => project.id === projectId);
    if (projectToEdit) {
      alert(`Editing project: ${projectToEdit.title}\nClient: ${projectToEdit.client}\nStatus: ${projectToEdit.status}\nBudget: $${projectToEdit.budget}`);
    }
  };

  const handleAddProject = () => {
    alert("Add new project functionality would open here");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <Header />
          <div className="admin-content">
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading projects...</div>
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
            <h2>Project Management</h2>
            <button className="btn-add-user" onClick={handleAddProject}>+ Add New Project</button>
          </div>

          <div className="user-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search projects..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Client</th>
                  <th>Budget</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => (
                  <tr key={project.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-name">{project.title}</div>
                        <div style={{fontSize: '12px', color: '#666'}}>{project.description}</div>
                      </div>
                    </td>
                    <td>{project.client}</td>
                    <td>${project.budget}</td>
                    <td>{project.deadline}</td>
                    <td>
                      <span className={`status-badge status-${project.status.toLowerCase().replace(' ', '')}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                        {project.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} style={{
                            background: '#f1f5f9',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#64748b'
                          }}>
                            {skill.name}
                          </span>
                        ))}
                        {project.skills.length > 3 && (
                          <span style={{fontSize: '11px', color: '#64748b'}}>
                            +{project.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditProject(project.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteProject(project.id)}
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

export default ProjectManagement;
