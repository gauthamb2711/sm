import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate, useLocation } from "react-router-dom";

const SIDEBAR_WIDTH = 280;

function SidebarLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      
      {/* 🌫️ GLASS SIDEBAR */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          padding: 2.5,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRight: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "10px 0 30px rgba(0,0,0,0.06)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          zIndex: 1300
        }}
      >
        {/* LOGO */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 20,
            mb: 3,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          ConnectHub
        </Typography>

        {/* MENU */}
        <List sx={{ flexGrow: 1 }}>
          <SidebarItem
            icon={<HomeIcon />}
            text="Dashboard"
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          />
          <SidebarItem
            icon={<PersonIcon />}
            text="Profile"
            active={location.pathname === "/profile"}
            onClick={() => navigate("/profile")}
          />
          <SidebarItem
            icon={<SearchIcon />}
            text="Search"
            active={location.pathname === "/search"}
            onClick={() => navigate("/search")}
          />
          <SidebarItem
            icon={<ExploreIcon />}
            text="Explore"
            active={location.pathname === "/explore"}
            onClick={() => navigate("/explore")}
          />

          <SidebarItem
            icon={<ChatIcon />}
            text="Messages"
            onClick={() => navigate("/chat")}
          />

          <SidebarItem
  icon={<BarChartIcon />}
  text="Creator Dashboard"
  onClick={() => navigate("/creator")}
/>

        </List>

        {/* LOGOUT */}
        <SidebarItem
          icon={<LogoutIcon />}
          text="Logout"
          onClick={() => navigate("/")}
        />
      </Box>

      {/* CONTENT */}
      <Box
        sx={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          minHeight: "100vh",
          overflowY: "auto",
          padding: 3
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* 🔥 ANIMATED SIDEBAR ITEM */
function SidebarItem({ icon, text, onClick, active }) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        borderRadius: "14px",
        mb: 0.8,
        paddingY: 1.2,
        paddingX: 1.5,
        background: active
          ? "linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))"
          : "transparent",
        transition: "all 0.3s ease",
        "&:hover": {
          background:
            "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))",
          transform: "translateX(6px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
        }
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 38,
          color: active ? "#667eea" : "#4b5563",
          transition: "0.3s"
        }}
      >
        {icon}
      </ListItemIcon>

      <ListItemText
        primary={text}
        primaryTypographyProps={{
          fontWeight: active ? 600 : 500,
          color: active ? "#111827" : "#374151"
        }}
      />
    </ListItemButton>
  );
}

export default SidebarLayout;
