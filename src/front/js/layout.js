import React, { useContext, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Context } from "./store/appContext";
import injectContext from "./store/appContext";
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Home } from "./pages/home";
import { Dashboard } from "./pages/dashboard";
import { LoginSignUp } from "./pages/login-signup";
import { PomodoroTimer } from "./component/dashboard/PomodoroTimer";
import { UploadFile } from "./component/dashboard/UploadFile";
import { Search } from "./pages/Search";
import { FavoritesList } from "./component/dashboard/FavoritesList";
import { KanbanBoard } from "./component/dashboard/KanbanBoard";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { FavoritesSearch } from "./pages/FavoritesSearch"
import { PomodoroProvider } from "./component/dashboard/PomodoroContext";

const Layout = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#ff2259', // Rojo para el color principal
      },
      secondary: {
        main: '#38b12e', // Verde para los pasos completados
      },
    },
  });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const commonBoxStyles = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
    padding: isMobile ? "16px" : "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
  }
  const { store } = useContext(Context);
  const isLoggedIn = !!store.token;

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

  return (
    <BrowserRouter>
     <ThemeProvider theme={theme}>
    <PomodoroProvider>
      <ScrollToTop>
        <ConditionalNavbar isLoggedIn={isLoggedIn} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignUp />} />

          {/* 🔥 Dashboard ahora maneja sus subrutas correctamente */}
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="" element={
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                  }}
                >
                    <PomodoroTimer />

                  <Box
                    sx={{
                      ...commonBoxStyles,
                      flex: 1,
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    <FavoritesList />
                  </Box>
                </Box>
                <Box
                  sx={{
                    background: "#fff",
                    padding: isMobile ? "16px" : "20px",
                    borderRadius: "12px",
                    width: "100%",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <KanbanBoard />
                </Box>
              </Box>
            } />
            <Route path="search" element={<Search />} />
            <Route path="upload" element={<UploadFile />} />
            <Route path="favorites" element={<FavoritesSearch />} />

          </Route>

          {/* Página 404 */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>

        <Footer />
      </ScrollToTop>
      </PomodoroProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const ConditionalNavbar = ({ isLoggedIn }) => {
  const location = useLocation();
  return !isLoggedIn && location.pathname !== "/dashboard" ? <Navbar /> : null;
};

export default injectContext(Layout);
