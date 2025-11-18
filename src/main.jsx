import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

function Root() {
    const storedTheme = localStorage.getItem("appTheme") || "light";
  const [mode, setMode] = useState(storedTheme);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode ? "#2196f3" : "#1976d2",
      },
    },
  });
const toggleTheme=()=>{
  const newTheme=mode==="light"?"dark":"light";
  setMode(newTheme)
  localStorage.setItem("appTheme",newTheme)
}
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App toggleTheme={toggleTheme} mode={mode}/>
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Root />
  // </StrictMode>
);
