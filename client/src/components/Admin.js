import { useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography
} from "@mui/material";

import { Bar, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Admin() {
  // 📊 DUMMY STATS (perfect for internship demo)
  const stats = {
    users: 10,
    posts: 25,
    likes: 120
  };

  // 📈 BAR CHART DATA
  const barData = {
    labels: ["Users", "Posts", "Likes"],
    datasets: [
      {
        label: "Platform Statistics",
        data: [stats.users, stats.posts, stats.likes],
        backgroundColor: ["#1976d2", "#2e7d32", "#d32f2f"]
      }
    ]
  };

  // 🥧 PIE CHART DATA
  const pieData = {
    labels: ["Users", "Posts", "Likes"],
    datasets: [
      {
        data: [stats.users, stats.posts, stats.likes],
        backgroundColor: ["#1976d2", "#2e7d32", "#d32f2f"]
      }
    ]
  };

  // 🧾 STAT CARD COMPONENT
  const StatCard = ({ title, value }) => (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        textAlign: "center",
        borderRadius: 3
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>

      <Typography variant="h4" sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard 📊
      </Typography>

      {/* STAT CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total Users" value={stats.users} />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard title="Total Posts" value={stats.posts} />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard title="Total Likes" value={stats.likes} />
        </Grid>
      </Grid>

      {/* CHARTS */}
      <Typography variant="h5" gutterBottom>
        Analytics Overview
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Users, Posts & Likes
            </Typography>
            <Bar data={barData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Engagement Distribution
            </Typography>
            <Pie data={pieData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Admin;
