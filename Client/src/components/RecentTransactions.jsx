import React from "react";
import "./RecentTransactions.css";

const RecentTransactions = ({ data }) => {
  const rows = data.length > 0 ? data : [
    ["TXN-001","Sarah Miller","Emma Wilson","Mobile App UI/UX","$3,200"],
    ["TXN-002","John Davis","James Chen","E-commerce Development","$5,800"],
    ["TXN-003","Tech Corp","Lisa Anderson","Content Writing","$1,200"],
    ["TXN-004","StartupHub","Alex Johnson","SEO Optimization","$2,500"],
    ["TXN-005","Marketing Pro","Mike Roberts","Social Media Campaign","$4,100"]
  ];

  return (
    <div className="transactions-card">
      <div className="transactions-header">
        <h4>Recent Transactions</h4>
        <a className="view-all" onClick={(e) => { e.preventDefault(); alert("View all transactions functionality would open here"); }}>View All</a>
      </div>
      <div className="table-wrap">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Client</th>
              <th>Freelancer</th>
              <th>Project</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td>{r.id || r[0]}</td>
                <td>{r.client || r[1]}</td>
                <td>{r.freelancer || r[2]}</td>
                <td>{r.project || r[3]}</td>
                <td>{r.amount || r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
