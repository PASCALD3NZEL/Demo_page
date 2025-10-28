import React from "react";
import "./TopPerformers.css";

const TopPerformers = ({ data }) => {
  const items = data.length > 0 ? data : [
    {rank:1, initials:"EW", name:"Emma Wilson", role:"UI/UX Designer", amount:"$124,500", projects:5, rating:4.8},
    {rank:2, initials:"JC", name:"James Chen", role:"Full Stack", amount:"$156,200", projects:52, rating:4.9},
    {rank:3, initials:"LA", name:"Lisa Anderson", role:"Content Writer", amount:"$98,400", projects:67, rating:4.9},
    {rank:4, initials:"AJ", name:"Alex Johnson", role:"SEO Specialist", amount:"$87,300", projects:43, rating:4.8},
  ];

  return (
    <div className="top-card">
      <h4>Top Performers</h4>
      <div className="top-list">
        {items.map(i=>(
          <div className="top-item" key={i.rank}>
            <div className="rank">{i.rank}</div>
            <div className="avatar">{i.initials}</div>
            <div className="info">
              <div className="name">{i.name}</div>
              <div className="meta">{i.role} · <span className="amt">{i.amount}</span></div>
              <div className="small">{i.rating} · {i.projects} projects</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;
