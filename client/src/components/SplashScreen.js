import { Box, Typography } from "@mui/material";

function SplashScreen() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2563eb, #4f46e5)",
        color: "#fff"
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          width: 90,
          height: 90,
          borderRadius: "20px",
          backgroundColor: "#fff",
          color: "#2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 800,
          mb: 2
        }}
      >
        C
      </Box>

      {/* APP NAME */}
      <Typography variant="h4" fontWeight={700}>
        ConnectHub
      </Typography>

      <Typography sx={{ mt: 1, opacity: 0.9 }}>
        Connecting people
      </Typography>
    </Box>
  );
}

export default SplashScreen;
