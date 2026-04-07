import React, { useEffect, useState } from "react";
import {
  MdAssignment,
  MdReportProblem,
  MdPendingActions,
} from "react-icons/md";
import { FaWalking, FaUsers } from "react-icons/fa";

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
} from "recharts";

import {
  Box,
  CircularProgress,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";

import API from "./api/api";

/* ================= HELPERS ================= */

const calculateGrowth = (current, previous) => {
  if (!previous) return 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};

const getThisWeek = () => {
  const now = new Date();
  const first = now.getDate() - now.getDay();
  const last = first + 6;

  return {
    from: new Date(now.setDate(first)).toISOString().slice(0, 10),
    to: new Date(now.setDate(last)).toISOString().slice(0, 10),
  };
};

const getThisMonth = () => {
  const now = new Date();
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  };
};

/* ================= COMPONENT ================= */

function Home() {
  const [loading, setLoading] = useState(false);

  const [kpi, setKpi] = useState({});
  const [prevKpi, setPrevKpi] = useState({});
  const [trend, setTrend] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* ================= FETCH ================= */

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const params = { from, to };

      const [kpiRes, trendRes, empRes, alertRes] = await Promise.all([
        API.get("/enterprise/kpi", { params }),
        API.get("/enterprise/trend", { params }),
        API.get("/enterprise/top-employees"),
        API.get("/enterprise/alerts"),
      ]);

      setKpi(kpiRes.data.data || {});
      setTrend(trendRes.data.data || []);
      setTopEmployees(empRes.data.data || []);
      setAlerts(alertRes.data.data || []);

      const prevRes = await API.get("/enterprise/kpi", {
        params: { from: "", to: "" },
      });

      setPrevKpi(prevRes.data.data || {});
    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================= KPI CONFIG ================= */

  const dashboardStats = [
    {
      title: "Total Line Walk",
      count: kpi.totalLineWalk || 0,
      prev: prevKpi.totalLineWalk || 0,
      icon: <FaWalking />,
      color: "linear-gradient(135deg,#667eea,#764ba2)",
    },
    {
      title: "Pending Line Walk",
      count: kpi.pendingLineWalk || 0,
      prev: prevKpi.pendingLineWalk || 0,
      icon: <MdPendingActions />,
      color: "linear-gradient(135deg,#f7971e,#ffd200)",
    },
    {
      title: "Near Miss",
      count: kpi.totalNearMiss || 0,
      prev: prevKpi.totalNearMiss || 0,
      icon: <MdReportProblem />,
      color: "linear-gradient(135deg,#ff416c,#ff4b2b)",
    },
    {
      title: "TBT",
      count: kpi.totalTBT || 0,
      prev: prevKpi.totalTBT || 0,
      icon: <MdAssignment />,
      color: "linear-gradient(135deg,#43cea2,#185a9d)",
    },
    {
      title: "Active Users",
      count: kpi.activeUsers || 0,
      prev: prevKpi.activeUsers || 0,
      icon: <FaUsers />,
      color: "linear-gradient(135deg,#00c6ff,#0072ff)",
    },
  ];

  /* ================= UI ================= */

  return (
    <main className="main-container" style={{ padding: 20, background: "#f4f6f8" }}>
      
      {/* ===== HEADER ===== */}
      <Typography variant="h4" fontWeight="bold" mb={2}>
        📊 Enterprise Dashboard
      </Typography>

      {/* ===== FILTERS ===== */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap">

          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />

          <TextField
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={fetchDashboard}
            sx={{ background: "#1976d2" }}
          >
            Apply
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              const { from, to } = getThisWeek();
              setFrom(from);
              setTo(to);
            }}
          >
            This Week
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              const { from, to } = getThisMonth();
              setFrom(from);
              setTo(to);
            }}
          >
            This Month
          </Button>

        </Box>
      </Paper>

      {/* ===== KPI CARDS ===== */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px,1fr))" gap={3} mb={3}>
        {dashboardStats.map((item, i) => {
          const growth = calculateGrowth(item.count, item.prev);

          return (
            <Paper
              key={i}
              sx={{
                p: 2,
                borderRadius: 4,
                color: "#fff",
                background: item.color,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14}>{item.title}</Typography>
                <Box fontSize={22}>{item.icon}</Box>
              </Box>

              <Typography variant="h4" fontWeight="bold">
                {item.count}
              </Typography>

              <Typography fontSize={13}>
                {growth}% vs previous
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* ===== LOADING ===== */}
      {loading && (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}

      {/* ===== CHARTS ===== */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>

        {/* TREND */}
        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" mb={1}>
            Activity Trend
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line type="monotone" dataKey="tbt" stroke="#1976d2" strokeWidth={3} />
              <Line type="monotone" dataKey="nearMiss" stroke="#d32f2f" strokeWidth={3} />
              <Line type="monotone" dataKey="lineWalk" stroke="#2e7d32" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* TOP EMPLOYEES */}
        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" mb={1}>
            Top Employees
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEmployees}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="total" fill="#1976d2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* ===== ALERTS ===== */}
      <Paper sx={{ p: 2, mt: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6">⚠️ Recent Alerts</Typography>

        {alerts.length === 0 ? (
          <Typography>No alerts</Typography>
        ) : (
          alerts.map((a) => (
            <Box
              key={a.id}
              sx={{
                p: 1,
                borderLeft: "5px solid red",
                mb: 1,
                background: "#fff5f5",
                borderRadius: 2,
              }}
            >
              <strong>{a.observations}</strong>
              <br />
              <small>{new Date(a.created_at).toLocaleString()}</small>
            </Box>
          ))
        )}
      </Paper>

      {/* ===== INSIGHTS ===== */}
      <Paper sx={{ p: 2, mt: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6">🧠 Insights</Typography>

        <Typography fontSize={14}>
          • Trend is {trend.length > 5 ? "increasing 📈" : "stable"}
        </Typography>

        <Typography fontSize={14}>
          • Top performer: {topEmployees[0]?.name || "N/A"}
        </Typography>
      </Paper>

    </main>
  );
}

export default Home;