import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { fetchPayments, fetchTasks, fetchClients, fetchFreelancers } from "../../services/api";
import "./UserManagement.css"; // Reuse the same CSS

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const [payments, tasks, clients, freelancers] = await Promise.all([
          fetchPayments(),
          fetchTasks(),
          fetchClients(),
          fetchFreelancers()
        ]);

        // Create a map for quick lookup
        const taskMap = tasks.reduce((map, task) => {
          map[task.id] = task;
          return map;
        }, {});

        const clientMap = clients.reduce((map, client) => {
          map[client.id] = client;
          return map;
        }, {});

        const freelancerMap = freelancers.reduce((map, freelancer) => {
          map[freelancer.id] = freelancer;
          return map;
        }, {});

        // Combine payment data with related information
        const enrichedTransactions = payments.map(payment => {
          const task = taskMap[payment.task_id];
          const client = task ? clientMap[task.client_id] : null;
          const freelancer = task ? freelancerMap[task.freelancer_id] : null;

          return {
            id: payment.id,
            transactionId: `TXN-${payment.id.toString().padStart(3, '0')}`,
            clientName: client ? client.name : "Unknown Client",
            freelancerName: freelancer ? freelancer.name : "Unknown Freelancer",
            projectTitle: task ? task.title : "Unknown Project",
            amount: payment.amount,
            status: payment.status || "Completed", // Assuming status from payment
            paymentDate: payment.created_at ? new Date(payment.created_at).toLocaleDateString() : "N/A",
            payment
          };
        });

        setTransactions(enrichedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || transaction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      alert(`Transaction Details:\nID: ${transaction.transactionId}\nClient: ${transaction.clientName}\nFreelancer: ${transaction.freelancerName}\nProject: ${transaction.projectTitle}\nAmount: $${transaction.amount}\nStatus: ${transaction.status}\nDate: ${transaction.paymentDate}`);
    }
  };

  const handleFollowUp = (transactionId) => {
    // In a real application, this could open a modal for follow-up actions
    alert(`Follow-up initiated for transaction ${transactionId}. This could include contacting parties, dispute resolution, etc.`);
  };

  const handleRefund = async (transactionId) => {
    if (window.confirm("Are you sure you want to process a refund for this transaction?")) {
      try {
        const response = await fetch(`http://localhost:5555/api/payments/${transactionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Refunded' }),
        });
        if (response.ok) {
          setTransactions(transactions.map(t =>
            t.id === transactionId ? { ...t, status: 'Refunded' } : t
          ));
          alert("Refund processed successfully!");
        } else {
          alert("Failed to process refund.");
        }
      } catch (error) {
        console.error('Error processing refund:', error);
        alert("Error processing refund.");
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <Header />
          <div className="admin-content">
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading transactions...</div>
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
            <h2>Transaction Management</h2>
          </div>

          <div className="user-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search transactions..."
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
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Client</th>
                  <th>Freelancer</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.transactionId}</td>
                    <td>{transaction.clientName}</td>
                    <td>{transaction.freelancerName}</td>
                    <td>{transaction.projectTitle}</td>
                    <td>${transaction.amount}</td>
                    <td>
                      <span className={`status-badge status-${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.paymentDate}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleViewDetails(transaction.id)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleRefund(transaction.id)}
                        >
                          Refund
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

export default TransactionManagement;
