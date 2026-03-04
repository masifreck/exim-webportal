import React from 'react';
import {
  MdAssignment,
  MdReportProblem,
  MdPendingActions,
} from 'react-icons/md';
import { FaWalking, FaUsers } from 'react-icons/fa';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

function Home() {
  // 🔹 Dashboard cards data (can be replaced with API response)
  const dashboardStats = [
    {
      title: 'Pending TBT',
      count: 8,
      icon: <MdAssignment className="card_icon" />,
    },
    {
      title: 'Pending Near Miss',
      count: 5,
      icon: <MdReportProblem className="card_icon" />,
    },
    {
      title: 'Pending Line Walk',
      count: 3,
      icon: <FaWalking className="card_icon" />,
    },
    {
      title: 'Pending Users',
      count: 2,
      icon: <FaUsers className="card_icon" />,
    },
    {
      title: 'Total Pending Actions',
      count: 18,
      icon: <MdPendingActions className="card_icon" />,
    },
  ];

  // 🔹 Chart data (pending trend)
  const pendingTrend = [
    { name: 'Mon', pending: 12 },
    { name: 'Tue', pending: 9 },
    { name: 'Wed', pending: 15 },
    { name: 'Thu', pending: 7 },
    { name: 'Fri', pending: 18 },
    { name: 'Sat', pending: 10 },
  ];

  return (
    <main className="main-container">
      {/* ===== Title ===== */}
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="main-cards">
        {dashboardStats.map((item, index) => (
          <div className="card" key={index}>
            <div className="card-inner">
              <h3>{item.title}</h3>
              {item.icon}
            </div>
            <h1>{item.count}</h1>
          </div>
        ))}
      </div>

      {/* ===== Charts ===== */}
      <div className="charts">
        {/* Bar Chart */}
        <div className="chart">
          <h3>Pending Approvals (Weekly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={pendingTrend}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="chart">
          <h3>Pending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={pendingTrend}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#f44336"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;