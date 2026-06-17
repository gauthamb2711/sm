import { createTheme } from "@mui/material/styles";

const theme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#2563eb"
      },
      background: {
        default: mode === "dark" ? "#020617" : "#f8fafc",
        paper: mode === "dark" ? "#020617" : "#ffffff"
      }
    },

    shape: {
      borderRadius: 16
    },

    typography: {
      fontFamily: "Inter, Roboto, sans-serif",
      h5: {
        fontWeight: 600
      },
      button: {
        textTransform: "none",
        fontWeight: 600
      }
    },

    components: {
      /* 🟦 CARDS */
      MuiCard: {
        styleOverrides: {
          root: {
            transition: "all 0.25s ease",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.12)"
            }
          }
        }
      },

      /* 🟦 PAPER */
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: "all 0.25s ease",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
          }
        }
      },

      /* 🟦 BUTTONS */
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.03)"
            }
          }
        }
      },

      /* 🟦 ICON BUTTONS */
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.1)"
            }
          }
        }
      },

      /* 🟦 TEXTFIELDS */
      MuiTextField: {
        defaultProps: {
          variant: "outlined"
        }
      },

      /* 🟦 LIST ITEMS */
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            marginBottom: 6
          }
        }
      }
    }
  });

export default theme;
