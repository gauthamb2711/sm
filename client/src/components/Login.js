import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      alert(res.data.message);
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Paper elevation={10} sx={{ p: 4, width: "100%", borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back 👋
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          Login to continue
        </Typography>

        <Box mt={3}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate("/register")}
          >
            Go to Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
