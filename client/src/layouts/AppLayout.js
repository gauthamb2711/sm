import { Box, Typography, IconButton } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function AppLayout({ children }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      
      {/* SIDEBAR */}
      <Box
        sx={{
          width: 260,
          background: "linear-gradient(180deg,#020617,#020617)",
          p: 3,
          borderRight: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Typography variant="h6" sx={{ mb: 4, color: "#a855f7" }}>
          🧠 Social AI
        </Typography>

        <NavItem icon={<ChatBubbleOutlineIcon />} label="Feed" onClick={() => navigate("/dashboard")} />
        <NavItem icon={<SearchIcon />} label="Search" onClick={() => navigate("/search")} />
        <NavItem icon={<ExploreIcon />} label="Explore" onClick={() => navigate("/explore")} />
        <NavItem icon={<PersonIcon />} label="Profile" onClick={() => navigate("/profile")} />

        <Box sx={{ mt: "auto" }}>
          <NavItem icon={<LogoutIcon />} label="Logout" onClick={() => navigate("/")} />
        </Box>
      </Box>

      {/* MAIN AREA */}
      <Box
        sx={{
          flex: 1,
          background: "radial-gradient(circle at top,#0f172a,#020617)",
          p: 5,
          overflowY: "auto"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function NavItem({ icon, label, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": {
          background: "rgba(168,85,247,0.15)"
        }
      }}
    >
      {icon}
      <Typography>{label}</Typography>
    </Box>
  );
}
