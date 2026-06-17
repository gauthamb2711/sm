import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress
} from "@mui/material";

function CreatorDashboard() {
  const userEmail = localStorage.getItem("userEmail");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`https://sm-1-o0j5.onrender.com/posts/user/${userEmail}`)
      .then((res) => setPosts(res.data));
  }, [userEmail]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Creator Dashboard
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => {
const reach = post.viewedBy?.length || 0;

const engagement =
  reach > 0
    ? (((post.likes + post.comments.length) / reach) * 100).toFixed(1)
    : 0;

            
         

          return (
           <Card key={post._id} sx={{ mb: 3 }}>
      <CardContent>
        <Typography>{post.text}</Typography>

        <Typography variant="caption">
          👁 Reach: {reach}
        </Typography>

        <Typography variant="caption" sx={{ ml: 2 }}>
          ❤️ Likes: {post.likes} • 💬 Comments: {post.comments.length}
        </Typography>

        <Typography variant="caption" display="block">
          📊 Engagement: {engagement}%
        </Typography>
      </CardContent>
    </Card>
  );
        })}
      </Grid>
    </Box>
  );
}

export default CreatorDashboard;
