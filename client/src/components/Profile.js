import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Avatar,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box
} from "@mui/material";

function Profile() {
  const [openModal, setOpenModal] = useState(false);
const [modalTitle, setModalTitle] = useState("");
const [userList, setUserList] = useState([]);

  const [posts, setPosts] = useState([]);
  const userEmail = localStorage.getItem("userEmail");
  const [stats, setStats] = useState({
  posts: 0,
  followers: 0,
  following: 0
});


  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/posts/user/${userEmail}`
      );
      setPosts(res.data);
    } catch {
      alert("Failed to load profile");
    }
  };


  useEffect(() => {
  const fetchStats = async () => {
    const res = await axios.get(
      `http://localhost:5000/profile-stats/${userEmail}`
    );
    setStats(res.data);
  };

  fetchStats();
}, [userEmail]);

const openFollowers = async () => {
  const res = await axios.get(
    `http://localhost:5000/followers/${userEmail}`
  );
  setUserList(res.data);
  setModalTitle("Followers");
  setOpenModal(true);
};

const openFollowing = async () => {
  const res = await axios.get(
    `http://localhost:5000/following-list/${userEmail}`
  );
  setUserList(res.data);
  setModalTitle("Following");
  setOpenModal(true);
};


  return (
    <Container
  sx={{
    animation: "fadeIn 0.4s ease-in-out"   // 👈 STEP 3
  }}
>

      {/* PROFILE HEADER */}
     <Paper
  sx={{
    p: 4,
    mb: 4,
    borderRadius: 4,
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
  }}
>
  <Grid container spacing={4} alignItems="center">
    {/* AVATAR */}
    <Grid item>
      <Avatar
        sx={{
          width: 120,
          height: 120,
          bgcolor: "#2563eb",
          fontSize: "3rem",
          fontWeight: "bold"
        }}
      >
        {userEmail?.charAt(0).toUpperCase()}
      </Avatar>
    </Grid>

    {/* USER INFO */}
    <Grid item xs>
      <Typography variant="h5" fontWeight={600}>
        {userEmail}
      </Typography>

      {/* STATS */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item>
          <Typography variant="subtitle1">
            <b>{stats.posts}</b> Posts
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="subtitle1">
            <b>{stats.followers}</b> Followers
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="subtitle1">
            <b>{stats.following}</b> Following
          </Typography>
        </Grid>
      </Grid>

      {/* ACTION BUTTON */}
      <Button
        variant="outlined"
        sx={{
          mt: 2,
          borderRadius: 999,
          textTransform: "none"
        }}
      >
        Edit Profile
      </Button>
    </Grid>
  </Grid>
</Paper>


      {/* USER POSTS */}
      <Grid container spacing={3}>
  {posts.map((post) => (
    <Grid item xs={12} sm={6} md={4} key={post._id}>
     
      <Card
  sx={{
    borderRadius: 3,
    transition: "all 0.25s ease-in-out",  // 👈 STEP 3
    "&:hover": {
      transform: "translateY(-4px)"
    }
  }}
>

        {/* IMAGE / VIDEO */}
        {post.image && (
          <img
            src={post.image}
            alt="post"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px"
            }}
          />
        )}

        {post.video && (
          <video
            src={post.video}
            controls
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover"
            }}
          />
        )}

        {/* TEXT */}
        <CardContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {post.text}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            ❤️ {post.likes} ·{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
  <DialogTitle>{modalTitle}</DialogTitle>

  <DialogContent>
    {userList.length === 0 ? (
      <Typography>No users</Typography>
    ) : (
      userList.map((email, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2
          }}
        >
          <Avatar>{email.charAt(0).toUpperCase()}</Avatar>
          <Typography>{email}</Typography>
        </Box>
      ))
    )}
  </DialogContent>
</Dialog>


    </Container>
  );
}

export default Profile;
