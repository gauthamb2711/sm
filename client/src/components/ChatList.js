import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  Avatar,
  TextField
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SidebarLayout from "./SidebarLayout";

const socket = io("http://localhost:5000");

function ChatList() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const [chats, setChats] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const [onlineMap, setOnlineMap] = useState({});
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);

  /* ================= LOAD INBOX ================= */
  const loadInbox = async () => {
    const res = await axios.get(
      `http://localhost:5000/chat-inbox/${userEmail}`
    );
    setChats(res.data);
  };

  /* ================= LOAD UNREAD ================= */
  const loadUnread = async () => {
    const res = await axios.get(
      `http://localhost:5000/unread-count/${userEmail}`
    );

    const map = {};
    res.data.forEach((u) => {
      map[u._id] = u.count;
    });

    setUnreadMap(map);
  };

  useEffect(() => {
    if (!userEmail) return;

    socket.emit("registerUser", userEmail);

    loadInbox();
    loadUnread();

    socket.on("newMessage", (msg) => {
      loadInbox();
      setUnreadMap((prev) => ({
        ...prev,
        [msg.sender]: (prev[msg.sender] || 0) + 1
      }));
    });

    socket.on("userStatus", ({ email, online }) => {
      setOnlineMap((prev) => ({
        ...prev,
        [email]: online
      }));
    });

    return () => {
      socket.off("newMessage");
      socket.off("userStatus");
    };
  }, [userEmail]);

  /* ================= SEARCH USERS ================= */
  const searchNewUsers = async (q) => {
    setSearch(q);
    if (!q) {
      setSearchUsers([]);
      return;
    }

    const res = await axios.get(
      `http://localhost:5000/search-users/${q}`
    );

    setSearchUsers(
      res.data.filter((u) => u.email !== userEmail)
    );
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Messages
        </Typography>

        <TextField
          fullWidth
          placeholder="Search or start new chat"
          value={search}
          onChange={(e) => searchNewUsers(e.target.value)}
        />

        <List sx={{ mt: 2 }}>
          {/* EXISTING CHATS */}
          {search === "" &&
            chats.map((c) => (
              <ListItemButton
                key={c.email}
                onClick={() => navigate(`/chat/${c.email}`)}
              >
                <Avatar sx={{ mr: 2 }}>
                  {c.email[0].toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography>{c.email}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {c.lastMessage}
                  </Typography>
                </Box>

                {/* ONLINE DOT */}
                {onlineMap[c.email] && (
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "green",
                      mr: 1
                    }}
                  />
                )}

                {/* UNREAD BADGE */}
                {unreadMap[c.email] && (
                  <Box
                    sx={{
                      minWidth: 22,
                      height: 22,
                      borderRadius: "50%",
                      bgcolor: "red",
                      color: "white",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {unreadMap[c.email]}
                  </Box>
                )}
              </ListItemButton>
            ))}

          {/* SEARCH RESULTS */}
          {search !== "" &&
            searchUsers.map((u) => (
              <ListItemButton
                key={u.email}
                onClick={() => navigate(`/chat/${u.email}`)}
              >
                <Avatar sx={{ mr: 2 }}>
                  {u.email[0].toUpperCase()}
                </Avatar>
                {u.email}
              </ListItemButton>
            ))}
        </List>
      </Box>
    </SidebarLayout>
  );
}

export default ChatList;
