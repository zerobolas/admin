import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Sidebar from "./Sidebar";
import Header from "./Header";
import GlobalToast from "./GlobalToast";

function Layout() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
    }
  }, [isSignedIn, navigate]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100dvh",
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <GlobalToast />
        <Header />
        <Sidebar />
        <Box
          id="main-content"
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflowY: "auto",
            gap: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

export default Layout;
