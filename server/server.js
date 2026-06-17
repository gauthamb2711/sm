require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const connectDB = require("./db");

const User = require("./models/User");
const Post = require("./models/Post");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ================= AUTH ================= */

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch {
    res.status(500).json({ message: "Register failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful" });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= POSTS ================= */

app.post("/create-post", async (req, res) => {
  try {
    const { text, userEmail, image, video } = req.body;

    const newPost = new Post({
      text,
      userEmail,
      image,
      video
    });

    await newPost.save();

    res.json({ message: "Post created successfully" });
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ message: "Post creation failed" });
  }
});



app.get("/posts/user/:email", async (req, res) => {
  try {
    const posts = await Post.find({ userEmail: req.params.email })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
});

app.post("/like-post/:id", async (req, res) => {
  try {
    const { userEmail } = req.body;

    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();

    const ownerSocket = users[post.userEmail];

    if (ownerSocket && post.userEmail !== userEmail) {
      io.to(ownerSocket).emit("notification", {
        message: `${userEmail} liked your post ❤️`
      });
    }

    io.emit("postUpdated");
    res.json({ message: "Post liked" });
  } catch (error) {
    console.error("LIKE ERROR:", error);
    res.status(500).json({ message: "Like failed" });
  }
});


app.post("/comment/:id", async (req, res) => {
  try {
    const { text, userEmail } = req.body;

    if (!text || !userEmail) {
      return res.status(400).json({ message: "Missing comment data" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ text, userEmail });
    await post.save();

    const ownerSocket = users[post.userEmail];

    if (ownerSocket && post.userEmail !== userEmail) {
      io.to(ownerSocket).emit("notification", {
        message: `${userEmail} commented on your post 💬`
      });
    }

    io.emit("postUpdated");
    res.json({ message: "Comment added" });

  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ message: "Comment failed" });
  }
});


app.delete("/delete-post/:id", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const post = await Post.findById(req.params.id);

    if (post.userEmail !== userEmail)
      return res.status(403).json({ message: "Not allowed" });

    await Post.findByIdAndDelete(req.params.id);

    io.emit("postUpdated");
    res.json({ message: "Post deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});


app.post("/view-post/:id", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.sendStatus(404);

    // ✅ UNIQUE VIEW = REACH
    if (!post.viewedBy.includes(userEmail)) {
      post.viewedBy.push(userEmail);
      post.views += 1;
      await post.save();
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("VIEW ERROR:", err);
    res.sendStatus(500);
  }
});




 // ADMIN STATS
app.get("/admin/stats", async (req, res) => {
  try {
    const { email } = req.query;

    // 🔐 Admin check
    if (email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Access denied" });
    }

    const usersCount = await User.countDocuments();
    const posts = await Post.find();

    const postsCount = posts.length;
    const likesCount = posts.reduce((sum, p) => sum + p.likes, 0);
    const commentsCount = posts.reduce(
      (sum, p) => sum + (p.comments ? p.comments.length : 0),
      0
    );

    res.json({
      usersCount,
      postsCount,
      likesCount,
      commentsCount
    });
  } catch (error) {
    res.status(500).json({ message: "Admin stats failed" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("FETCH POSTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// ✏️ EDIT POST
app.put("/edit-post/:id", async (req, res) => {
  try {
    const { text, userEmail } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔐 Ownership check
    if (post.userEmail !== userEmail) {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.text = text;
    await post.save();

    io.emit("postUpdated"); // real-time refresh
    res.json({ message: "Post updated successfully" });

  } catch (error) {
    console.error("EDIT ERROR:", error);
    res.status(500).json({ message: "Edit failed" });
  }
});

// 👥 FOLLOW / UNFOLLOW USER
app.post("/follow", async (req, res) => {
  try {
    const { userEmail, targetEmail } = req.body;

    const user = await User.findOne({ email: userEmail });
    const targetUser = await User.findOne({ email: targetEmail });

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = user.following.includes(targetEmail);

    if (isFollowing) {
      // UNFOLLOW
      user.following = user.following.filter(e => e !== targetEmail);
      targetUser.followers = targetUser.followers.filter(
        e => e !== userEmail
      );
    } else {
      // FOLLOW
      user.following.push(targetEmail);
      targetUser.followers.push(userEmail);
    }

    if (isFollowing) {
  user.following = user.following.filter(e => e !== targetEmail);
  targetUser.followers = targetUser.followers.filter(e => e !== userEmail);
} else {
  user.following.push(targetEmail);
  targetUser.followers.push(userEmail);

  // 🔔 NOTIFY TARGET USER
  io.emit("notification", {
    message: `${userEmail} started following you`,
    target: targetEmail
  });
}


    await user.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? "Unfollowed" : "Followed"
    });

  } catch (error) {
    console.error("FOLLOW ERROR:", error);
    res.status(500).json({ message: "Follow failed" });
  }
});



// 📌 GET FOLLOWING USERS
app.get("/following/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Failed to get following" });
  }
});

// 👤 PROFILE STATS
app.get("/profile-stats/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    const postsCount = await Post.countDocuments({
      userEmail: req.params.email
    });

    res.json({
      posts: postsCount,
      followers: user.followers.length,
      following: user.following.length
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile stats" });
  }
});

// 🔍 SEARCH USERS
app.get("/search-users/:query", async (req, res) => {
  try {
    const query = req.params.query;

    const users = await User.find({
      email: { $regex: query, $options: "i" }
    }).select("email followers following");

    res.json(users);
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// 👥 GET FOLLOWERS
app.get("/followers/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch followers" });
  }
});

// 👥 GET FOLLOWING
app.get("/following-list/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch following" });
  }
});


// Message

app.post("/send-message", async (req, res) => {
  const { sender, receiver, text, image } = req.body;

  const msg = new Message({
    sender,
    receiver,
    text,
    image,
    delivered: true,
    seen: false
  });

  await msg.save();

  const receiverSocket = users[receiver];
  if (receiverSocket) {
    io.to(receiverSocket).emit("receiveMessage", msg);
  }

  res.json(msg);
});


app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

// 📥 CHAT INBOX (users you already messaged)
app.get("/chat-inbox/:email", async (req, res) => {
  const email = req.params.email;

  const messages = await Message.find({
    $or: [{ sender: email }, { receiver: email }]
  }).sort({ createdAt: -1 });

  const inbox = {};
  
  messages.forEach((m) => {
    const otherUser =
      m.sender === email ? m.receiver : m.sender;

    if (!inbox[otherUser]) {
      inbox[otherUser] = {
        email: otherUser,
        lastMessage: m.text || "📷 Image",
        time: m.createdAt
      };
    }
  });

  res.json(Object.values(inbox));
});

//unread count
app.get("/unread-count/:email", async (req, res) => {
  const email = req.params.email;

  const unread = await Message.aggregate([
    {
      $match: {
        receiver: email,
        seen: false
      }
    },
    {
      $group: {
        _id: "$sender",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(unread);
});


app.post("/mark-seen/:sender/:receiver", async (req, res) => {
  await Message.updateMany(
    { sender: req.params.sender, receiver: req.params.receiver },
    { seen: true }
  );

  res.sendStatus(200);
});






/* ================= SOCKET.IO ================= */

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const users = {};


io.on("connection", (socket) => {
  socket.on("registerUser", (email) => {
    users[email] = socket.id;
    io.emit("userStatus", { email, online: true });
  });

  socket.on("disconnect", () => {
    for (let email in users) {
      if (users[email] === socket.id) {
        delete users[email];
        io.emit("userStatus", { email, online: false });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
