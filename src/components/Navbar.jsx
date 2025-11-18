import {
  AppBar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { filterStock } from "../redux/stockSlice";
import { useCallback, useMemo } from "react";
export const Navbar = ({ toggleTheme, mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const handleLogo = () => {
    navigate("/");
  };
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
  const debouncedSearch = useMemo(() => 
   debounce((value) => {
      dispatch(filterStock(value));
    }, 500),
   [dispatch]);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };
  
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ width: "100%", height: "60px", justifyContent: "center" }}
      >
        <Toolbar
          variant="dense"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            onClick={handleLogo}
            sx={{ cursor: "pointer" }}
          >
            Stock Charts
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            onChange={handleSearchChange}
            sx={{
              width: { sm: 220, md: 300 },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#fff",
              borderRadius: "8px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "50%" }}
          >
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "light" ? <NightlightRoundIcon /> : <LightModeIcon />}
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
