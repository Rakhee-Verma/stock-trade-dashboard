import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const MaintenancePage = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        textAlign: "center",
        p: { xs: 2, sm: 3, md: 4 },
        width: { xs: "250px",sm:'450px',md:"70%",lg:'100%' },
        marginLeft:{ xs:"12rem",lg:0},
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: 3,
            p: { xs: 3, sm: 4, md: 5 },
            width: "100%",
          }}
        >
          <ConstructionIcon
            sx={{
              fontSize: { xs: 60, sm: 70, md: 80 },
              color: "primary.main",
              mb: { xs: 1.5, sm: 2 },
            }}
          />

          <Typography
            variant="h4"
            gutterBottom
            fontWeight={600}
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
            }}
          >
            We’ll Be Back Soon!
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            mb={{ xs: 2, sm: 3 }}
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Our site is currently undergoing scheduled maintenance. <br />
            We’re working hard to bring things back online as quickly as
            possible.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleReload}
            sx={{
              borderRadius: 2,
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.85rem", sm: "1rem" },
            }}
          >
            Refresh Page
          </Button>

          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            mt={{ xs: 3, sm: 4 }}
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
            }}
          >
            &copy; {new Date().getFullYear()} Your Company Name. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MaintenancePage;
