import React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "../../context/ThemeContext";

export default function AppContent({ drawerWidth, children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  // Уменьшаем ширину бокового меню для ретро-темы на мобильных
  const actualDrawerWidth =
    isRetroTheme && isMobile ? Math.min(drawerWidth - 40, 200) : drawerWidth;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        // Минимальные отступы для всех тем
        p: isRetroTheme && isMobile ? 0.5 : { xs: 1, sm: 2 },
        width: { sm: `calc(100% - ${actualDrawerWidth}px)` },
        // Увеличиваем отступ сверху, чтобы контент не был слишком близко к верхней части
        pt: isRetroTheme && isMobile ? 4 : { xs: 5, sm: 6 },
        // Полностью убираем marginTop и заменяем его на paddingTop
        marginTop: 0,
        overflowX: "hidden", // Предотвращаем горизонтальную прокрутку
        // Добавляем стили для всех дочерних элементов
        "& > *:first-of-type": {
          // Уменьшаем отступ для первого элемента
          marginTop: isRetroTheme && isMobile ? 0 : { xs: 1, sm: 2 },
        },
        "& .MuiGrid-container": {
          // Уменьшаем отступы в сетке для ретро-темы на мобильных
          margin: isRetroTheme && isMobile ? -0.5 : undefined,
          // Уменьшаем расстояние между элементами сетки
          spacing: isRetroTheme && isMobile ? 1 : { xs: 2, sm: 3 },
        },
        "& .MuiGrid-item": {
          // Уменьшаем отступы в сетке для ретро-темы на мобильных
          padding: isRetroTheme && isMobile ? "2px !important" : undefined,
        },
        "& .MuiCard-root": {
          // Уменьшаем отступы в карточках для ретро-темы на мобильных
          margin: isRetroTheme && isMobile ? 0 : undefined,
        },
        "& .MuiCardContent-root": {
          // Уменьшаем отступы в содержимом карточек для ретро-темы на мобильных
          padding: isRetroTheme && isMobile ? "4px !important" : undefined,
        },
        "& .MuiCardHeader-root": {
          // Уменьшаем отступы в заголовках карточек для ретро-темы на мобильных
          padding: isRetroTheme && isMobile ? "4px !important" : undefined,
        },
        // Уменьшаем отступы для типографики
        "& .MuiTypography-gutterBottom": {
          marginBottom:
            isRetroTheme && isMobile ? "0.25em !important" : undefined,
        },
      }}
    >
      {children}
    </Box>
  );
}
