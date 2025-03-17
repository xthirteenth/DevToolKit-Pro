import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";
import AppContent from "./AppContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "../../context/ThemeContext";

// Константа для ширины бокового меню
const drawerWidth = 240;

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  // Уменьшаем ширину бокового меню для ретро-темы на мобильных
  const actualDrawerWidth =
    isRetroTheme && isMobile ? Math.min(drawerWidth - 40, 200) : drawerWidth;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        // Добавляем отрицательный margin-top для компенсации отступа
        marginTop: isRetroTheme && isMobile ? "-20px" : 0,
      }}
    >
      <AppNavbar
        drawerWidth={actualDrawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />

      <AppSidebar
        drawerWidth={actualDrawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <AppContent drawerWidth={actualDrawerWidth}>{children}</AppContent>
    </Box>
  );
}
