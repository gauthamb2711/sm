import { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Card,
  CardHeader,
  Avatar,
  Button,
  Box,
  Typography
} from "@mui/material";

function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const userEmail = localStorage.getItem("userEmail");

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setUsers([]);
      return;
    }

    const res = await axios.get(
      `http://localhost:5000/search-users/${value}`
    );
    setUsers(res.data);
  };

  const handleFollow = async (targetEmail) => {
    await axios.post("http://localhost:5000/follow", {
      userEmail,
      targetEmail
    });

    handleSearch(query);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        🔍 Search Users
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by email..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      {users.map((user) => (
        <Card key={user.email} sx={{ mb: 2 }}>
          <CardHeader
            avatar={
              <Avatar>
                {user.email.charAt(0).toUpperCase()}
              </Avatar>
            }
            title={user.email}
            action={
              user.email !== userEmail && (
                <Button
                  size="small"
                  variant={
                    user.followers.includes(userEmail)
                      ? "outlined"
                      : "contained"
                  }
                  onClick={() => handleFollow(user.email)}
                >
                  {user.followers.includes(userEmail)
                    ? "Unfollow"
                    : "Follow"}
                </Button>
              )
            }
          />
        </Card>
      ))}
    </Container>
  );
}

export default Search;
