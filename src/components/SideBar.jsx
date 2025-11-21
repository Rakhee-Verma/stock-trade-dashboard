import { Box, List, ListItem, ListItemText, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
  const theme = useTheme();
  const location = useLocation(); 

  const menuItems = [
    { text: "Dashboard", path: "/" },
    { text: "Stocks", path: "/stockCards" },
    { text: "Positions", path: "/tradeInfoTable" },
    { text: "Funding Account", path: "/fundingAccount" },
  ];

  return (
    <Box
      sx={{
        width: "150px",
        height: "100vh",
        position: "fixed",
        top: 60,
        left: 0,
        overflowY: "auto",
        padding: "20px",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "#fff",
        boxShadow:
          theme.palette.mode === "dark"
            ? "2px 0 5px rgba(255, 255, 255, 0.3)"
            : "2px 0 5px rgba(0,0,0,0.1)",
        "& .MuiListItemText-root": {
          color: theme.palette.mode === "dark" ? "#fff" : "#333",
        },
      }}
    >
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.text}
              sx={{
                backgroundColor: isActive
                  ? theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.1)"
                  : "transparent",
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
