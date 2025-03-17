import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExtensionIcon from "@mui/icons-material/Extension";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

// Функция для получения сокращенного текста на мобильных устройствах
const getMobileText = (text) => {
  const shortNames = {
    Главная: "Глав",
    Модули: "Мод",
    Калькулятор: "Кальк",
    Настройки: "Настр",
    Профиль: "Проф",
    Войти: "Вход",
    Выйти: "Выход",
    Регистрация: "Рег",
  };
  return shortNames[text] || text;
};

export default function AppSidebar({ open, handleDrawerToggle, drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";
  const { isAuthenticated, logout } = useAuth();

  // Состояние для модального окна подтверждения выхода
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Определение фактической ширины drawer в зависимости от темы и устройства
  const actualDrawerWidth = isRetroTheme && isMobile ? 80 : drawerWidth;

  // Базовые пункты меню
  const menuItems = [
    { text: "Главная", icon: <HomeIcon />, path: "/" },
    { text: "Модули", icon: <ExtensionIcon />, path: "/modules" },
    { text: "Калькулятор", icon: <CalculateIcon />, path: "/calculator" },
    { text: "Настройки", icon: <SettingsIcon />, path: "/settings" },
  ];

  // Добавление пунктов меню в зависимости от статуса авторизации
  if (isAuthenticated) {
    menuItems.push({ text: "Профиль", icon: <PersonIcon />, path: "/profile" });
    menuItems.push({ text: "Выйти", icon: <LogoutIcon />, path: "/logout" });
  } else {
    menuItems.push({ text: "Войти", icon: <LoginIcon />, path: "/login" });
  }

  // Обработчик для открытия диалога подтверждения выхода
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);

    // Закрываем drawer на мобильных устройствах
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  // Обработчик для закрытия диалога без выхода
  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Обработчик для подтверждения выхода
  const handleLogoutConfirm = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    if (path === "/logout") {
      handleLogoutClick();
    } else {
      navigate(path);

      // Закрываем drawer на мобильных устройствах после выбора пункта меню
      if (isMobile) {
        handleDrawerToggle();
      }
    }
  };

  const drawer = (
    <div>
      <Toolbar
        sx={{
          height: isRetroTheme && isMobile ? 56 : 64,
          minHeight: isRetroTheme && isMobile ? 56 : 64,
          px: isRetroTheme && isMobile ? 1 : 2,
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontSize: isRetroTheme && isMobile ? "0.9rem" : "inherit",
            letterSpacing: isRetroTheme && isMobile ? "-0.5px" : "inherit",
          }}
        >
          DevToolkit Pro
        </Typography>
      </Toolbar>
      <Divider />
      <List
        dense={isRetroTheme && isMobile}
        sx={{
          "& .MuiListItem-root": {
            padding: isRetroTheme && isMobile ? "2px 8px" : undefined,
          },
        }}
      >
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: isRetroTheme && isMobile ? 40 : 48,
                px: isRetroTheme && isMobile ? 1.5 : 2.5,
                ...(location.pathname === item.path &&
                  isRetroTheme && {
                    backgroundColor: "rgba(144, 238, 144, 0.2)",
                    boxShadow: "0 0 5px #90ee90",
                    "&:hover": {
                      backgroundColor: "rgba(144, 238, 144, 0.3)",
                    },
                  }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isRetroTheme && isMobile ? 36 : 56,
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "inherit",
                  "& .MuiSvgIcon-root": {
                    fontSize: isRetroTheme && isMobile ? "1.2rem" : "1.5rem",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  isMobile && isRetroTheme
                    ? getMobileText(item.text)
                    : item.text
                }
                primaryTypographyProps={{
                  fontSize: isRetroTheme && isMobile ? "0.75rem" : "inherit",
                  letterSpacing:
                    isRetroTheme && isMobile ? "-0.5px" : "inherit",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{ width: { sm: actualDrawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Мобильная версия */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Лучшая производительность на мобильных устройствах
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: actualDrawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Десктопная версия */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: actualDrawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Диалог подтверждения выхода */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Подтверждение выхода</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Вы действительно хотите выйти из аккаунта?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            Выйти
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
