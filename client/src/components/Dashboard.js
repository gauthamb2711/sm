import SidebarLayout from "./SidebarLayout";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Typography,
  Container,
  Grid,
  Paper,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Fab,
  Modal,
  Button
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const SIDEBAR_WIDTH = 280;
const TOPBAR_HEIGHT = 64;

const socket = io("http://localhost:5000");

function Dashboard() {
  const userEmail = localStorage.getItem("userEmail");

  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [postText, setPostText] = useState("");
  const [media, setMedia] = useState(null);
  const [openComposer, setOpenComposer] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [comments, setComments] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [likedPost, setLikedPost] = useState(null);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!userEmail) return;

    socket.emit("registerUser", userEmail);

    socket.on("notification", (data) => {
      if (!data.target || data.target === userEmail) {
        setNotifications((prev) => [data.message, ...prev]);
      }
    });

    socket.on("postUpdated", fetchPosts);

    return () => {
      socket.off("notification");
      socket.off("postUpdated");
    };
  }, [userEmail, following]);

  /* ================= FETCH FOLLOWING ================= */
  useEffect(() => {
    if (!userEmail) return;

    axios
      .get(`http://localhost:5000/following/${userEmail}`)
      .then((res) => setFollowing(res.data));
  }, [userEmail]);

  /* ================= FETCH POSTS ================= */
  useEffect(() => {
    fetchPosts();
  }, [following]);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/posts");

    const filtered = res.data.filter(
      (post) =>
        post.userEmail === userEmail ||
        following.includes(post.userEmail)
    );

    setPosts(filtered);
  };

  useEffect(() => {
  posts.forEach(post => {
    axios.post(`http://localhost:5000/view-post/${post._id}`, {
      userEmail
    });
  });
}, [posts]);


useEffect(() => {
  if (!userEmail || posts.length === 0) return;

  posts.forEach(post => {
    axios.post(`http://localhost:5000/view-post/${post._id}`, {
      userEmail
    });
  });
}, [posts, userEmail]);


  /* ================= CREATE POST ================= */
  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "social_media_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dummruyoz/upload",
      { method: "POST", body: fd }
    );

    return (await res.json()).secure_url;
  };

  const handleCreatePost = async () => {
    if (!postText.trim()) return;

    let image = "", video = "";
    if (media) {
      const url = await uploadToCloudinary(media);
      media.type.startsWith("image") ? (image = url) : (video = url);
    }

    await axios.post("http://localhost:5000/create-post", {
      text: postText,
      userEmail,
      image,
      video
    });

    setPostText("");
    setMedia(null);
    setOpenComposer(false);
    fetchPosts();
  };

  /* ================= EDIT POST ================= */
  const handleEditPost = async () => {
    if (!editText.trim()) return;

    await axios.put(
      `http://localhost:5000/edit-post/${editingPost._id}`,
      { text: editText, userEmail }
    );

    setEditingPost(null);
    setEditText("");
    fetchPosts();
  };

  /* ================= ACTIONS ================= */
  const handleLike = async (id) => {
    setLikedPost(id);
    await axios.post(`http://localhost:5000/like-post/${id}`, { userEmail });
    setTimeout(() => setLikedPost(null), 300);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/delete-post/${id}`, {
      data: { userEmail }
    });
    fetchPosts();
  };

  const handleComment = async (id) => {
    if (!comments[id]?.trim()) return;

    await axios.post(`http://localhost:5000/comment/${id}`, {
      text: comments[id],
      userEmail
    });

    setComments((p) => ({ ...p, [id]: "" }));
    fetchPosts();
  };

  /* ================= UI ================= */
  return (
    <SidebarLayout>
      <Box
        sx={{
          minHeight: "100vh",
          background: `
            radial-gradient(circle at 10% 10%, rgba(255,200,255,0.35), transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(180,220,255,0.4), transparent 40%),
            linear-gradient(135deg, #f5f7fa, #e4ecf7)
          `
        }}
      >
        {/* TOP BAR */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            left: `${SIDEBAR_WIDTH}px`,
            width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
            height: `${TOPBAR_HEIGHT}px`,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.4)",
            color: "#111827",
            zIndex: 1200
          }}
        >
          <Box sx={{ height: "100%", px: 3, display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
              Welcome, {userEmail}
            </Typography>
          </Box>
        </AppBar>

        {/* NOTIFICATIONS */}
        <Box sx={{ position: "fixed", top: 80, right: 20, zIndex: 2000 }}>
          {notifications.slice(0, 3).map((n, i) => (
            <Paper
              key={i}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 2,
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)"
              }}
            >
              🔔 {n}
            </Paper>
          ))}
        </Box>

        <Container maxWidth="lg" sx={{ mt: `${TOPBAR_HEIGHT + 32}px`, pb: 6 }}>
          <Grid container>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {posts.map((post) => (
                  <Card
                    key={post._id}
                    sx={{
                      background: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(14px)",
                      borderRadius: "16px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                      border: "1px solid rgba(255,255,255,0.3)"
                    }}
                  >
                    <CardHeader
                      avatar={<Avatar>{post.userEmail[0]}</Avatar>}
                      title={post.userEmail}
                      action={
                        post.userEmail === userEmail && (
                          <>
                            <IconButton
                              onClick={() => {
                                setEditingPost(post);
                                setEditText(post.text);
                              }}
                            >
                              ✏️
                            </IconButton>
                            <IconButton onClick={() => handleDelete(post._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )
                      }
                    />

                    <CardContent>
                      <Typography sx={{ lineHeight: 1.6, color: "#374151" }}>
                        {post.text}
                      </Typography>

                      {post.image && (
                        <img src={post.image} width="100%" style={{ marginTop: 12, borderRadius: 12 }} />
                      )}
                      {post.video && (
                        <video src={post.video} controls width="100%" />
                      )}
                    </CardContent>

                    <CardActions>
                      <IconButton
                        onClick={() => handleLike(post._id)}
                        sx={{
                          transform: likedPost === post._id ? "scale(1.3)" : "scale(1)",
                          color: likedPost === post._id ? "red" : "inherit",
                          transition: "0.2s"
                        }}
                      >
                        <FavoriteIcon /> {post.likes}
                      </IconButton>
                    </CardActions>

                    <CardContent>
                      <List dense>
                        {post.comments?.map((c, i) => (
                          <ListItem key={i}>
                            <ListItemText primary={c.text} secondary={c.userEmail} />
                          </ListItem>
                        ))}
                      </List>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Write a comment…"
                          value={comments[post._id] || ""}
                          onChange={(e) =>
                            setComments((p) => ({
                              ...p,
                              [post._id]: e.target.value
                            }))
                          }
                        />
                        <Button onClick={() => handleComment(post._id)}>Post</Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* CREATE POST BUTTON */}
        <Fab
          onClick={() => setOpenComposer(true)}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff"
          }}
        >
          <AddIcon />
        </Fab>

        {/* CREATE POST MODAL */}
        <Modal open={openComposer} onClose={() => setOpenComposer(false)}>
          <Box
            sx={{
              width: 420,
              p: 3,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              borderRadius: "16px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
              mx: "auto",
              mt: "10%"
            }}
          >
            <Typography mb={2}>New Post</Typography>
            <TextField fullWidth multiline rows={4} value={postText} onChange={(e) => setPostText(e.target.value)} />
            <input type="file" accept="image/*,video/*" onChange={(e) => setMedia(e.target.files[0])} style={{ marginTop: 10 }} />
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button variant="outlined" fullWidth onClick={() => setOpenComposer(false)}>Cancel</Button>
              <Button fullWidth onClick={handleCreatePost}>Post</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </SidebarLayout>
  );
}

export default Dashboard;
