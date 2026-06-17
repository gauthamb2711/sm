import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box
} from "@mui/material";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchPosts();
    fetchFollowing();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("https://sm-1-o0j5.onrender.com/posts");
    setPosts(res.data);
  };

  const fetchFollowing = async () => {
    const res = await axios.get(
      `https://sm-1-o0j5.onrender.com/following/${userEmail}`
    );
    setFollowing(res.data);
  };

  const handleFollow = async (targetEmail) => {
    await axios.post("https://sm-1-o0j5.onrender.com/follow", {
      userEmail,
      targetEmail
    });
    fetchFollowing();
  };

  return (
    <Container
  sx={{
    animation: "fadeIn 0.4s ease-in-out"   // 👈 STEP 3
  }}
>

      <Typography variant="h5" sx={{ mb: 3 }}>
        🌍 Explore
      </Typography>

      {posts.map((post) => (
        <Card
  key={post._id}
  sx={{
    mb: 4,
    borderRadius: 4,
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.12)"
    }
  }}
>

          <CardHeader
            avatar={
              <Avatar
  sx={{
    bgcolor: "#2563eb",
    width: 44,
    height: 44,
    fontWeight: "bold"
  }}
>
  {post.userEmail.charAt(0).toUpperCase()}
</Avatar>
            }
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
  {post.userEmail}
</Typography>


                {post.userEmail !== userEmail && (
                  <Button
                    size="small"
                    variant={
                      following.includes(post.userEmail)
                        ? "outlined"
                        : "contained"
                    }
                    onClick={() => handleFollow(post.userEmail)}
                  >
                    {following.includes(post.userEmail)
                      ? "Unfollow"
                      : "Follow"}
                  </Button>
                )}
              </Box>
            }
          />

          <CardContent>
            <Typography
  variant="body1"
  sx={{ mt: 1, lineHeight: 1.6 }}
>
  {post.text}
</Typography>


            {post.image && (
              <img
  src={post.image}
  alt="post"
  style={{
    width: "100%",
    borderRadius: "14px",
    marginTop: "14px"
  }}
/>

            )}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default Explore;
