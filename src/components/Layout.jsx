// src/components/Layout.jsx
import React from "react";
import { Navbar } from "./Navbar";
import { SideBar } from "./SideBar";
import { Box } from "@mui/material";

const Layout = ({ children, toggleTheme, mode }) => {
  return (
    <>
      {/* Top Navbar */}
      <Navbar toggleTheme={toggleTheme} mode={mode} />

      <Box sx={{ display: "flex" }}>
        {/* Left Sidebar */}
        <SideBar />

        {/* Middle Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 3,
            marginLeft: "80px",   // adjust based on your sidebar width
            marginTop: "64px",     // adjust based on navbar height
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
