import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography
} from "@mui/material";
import { io } from "socket.io-client";
import SidebarLayout from "./SidebarLayout";

const socket = io("http://localhost:5000");

function Chat() {
  const { email: targetEmail } = useParams();
  const userEmail = localStorage.getItem("userEmail");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔹 Load history
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/messages/${userEmail}/${targetEmail}`
      )
      .then((res) => setMessages(res.data));
  }, [userEmail, targetEmail]);

  // 🔹 Socket
  useEffect(() => {
    socket.emit("registerUser", userEmail);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, [userEmail]);

  // 🔹 Send
  const sendMessage = async () => {
    if (!message.trim()) return;

    const res = await axios.post(
      "http://localhost:5000/send-message",
      {
        sender: userEmail,
        receiver: targetEmail,
        text: message
      }
    );

    setMessages((prev) => [...prev, res.data]);
    setMessage("");
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">
          Chat with {targetEmail}
        </Typography>

        <Box sx={{ my: 2 }}>
          {messages.map((m, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <b>{m.sender === userEmail ? "You" : m.sender}:</b>{" "}
              {m.text}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
        </Box>
      </Box>
    </SidebarLayout>
  );
}

export default Chat;
