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

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("https://sm-1-o0j5.onrender.com/register", {
        name,
        email,
        password
      });

      alert(res.data.message);
      navigate("/"); // go to login after register
    } catch {
      alert("Register failed");
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
          Create Account 🚀
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          Join our social media platform
        </Typography>

        <Box mt={3}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
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
            onClick={handleRegister}
          >
            Register
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate("/")}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
