import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import TimerIcon from "@mui/icons-material/Timer";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";

export default function AppNavbar({ drawerWidth, handleDrawerToggle }) {
  const [time, setTime] = useState(new Date());
  const theme = useTheme();
  const { currentTheme, toggleTheme } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isRetroTheme = currentTheme === "retro";
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Состояние для меню пользователя
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Функция для форматирования времени
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    // На мобильных устройствах не показываем секунды
    return isMobile ? `${hours}:${minutes}` : `${hours}:${minutes}:${seconds}`;
  };

  // Определяем иконку и текст подсказки для кнопки темы
  const getThemeIcon = () => {
    switch (currentTheme) {
      case "light":
        return <Brightness7Icon fontSize={isMobile ? "small" : "medium"} />;
      case "dark":
        return <Brightness4Icon fontSize={isMobile ? "small" : "medium"} />;
      case "retro":
        return <VideogameAssetIcon fontSize={isMobile ? "small" : "medium"} />;
      default:
        return (
          <SettingsBrightnessIcon fontSize={isMobile ? "small" : "medium"} />
        );
    }
  };

  const getThemeTooltip = () => {
    switch (currentTheme) {
      case "dark":
        return "Темная тема (нажмите для переключения на светлую)";
      case "light":
        return "Светлая тема (нажмите для переключения на ретро)";
      case "retro":
        return "Ретро тема (нажмите для переключения на темную)";
      default:
        return "Переключить тему";
    }
  };

  // Обработчики для меню пользователя
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        height: isRetroTheme && isMobile ? "30px" : { xs: "40px", sm: "50px" },
      }}
    >
      <Toolbar
        disableGutters
        variant="dense"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight:
            isRetroTheme && isMobile
              ? "30px !important"
              : { xs: "40px !important", sm: "50px !important" },
          padding:
            isRetroTheme && isMobile
              ? "0px 8px !important"
              : { xs: "0px 8px !important", sm: "0px 16px !important" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { sm: "none" } }}
            size={isMobile ? "small" : "medium"}
          >
            <MenuIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            noWrap
            component="div"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            DevToolkit Pro
          </Typography>
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          <Tooltip title={getThemeTooltip()}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              aria-label="toggle theme"
              size={isMobile ? "small" : "medium"}
            >
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
                padding: { xs: "2px 8px", sm: "4px 12px" },
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <TimerIcon
                sx={{
                  mr: { xs: 0.5, sm: 1 },
                  color: theme.palette.secondary.main,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              />
              <Typography
                variant="body2"
                component="div"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  letterSpacing: "0.05em",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                }}
              >
                {formatTime(time)}
              </Typography>
            </Box>
          )}

          {isAuthenticated && user ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(255, 255, 255, 0.2)",
                  borderRadius: "16px",
                  padding: { xs: "2px 8px", sm: "4px 12px" },
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onClick={handleMenu}
              >
                <AccountCircleIcon
                  sx={{
                    mr: { xs: 0.5, sm: 1 },
                    color: theme.palette.primary.main,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                />
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  }}
                >
                  {user.username}
                </Typography>
              </Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Профиль</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                color="inherit"
                size={isMobile ? "small" : "medium"}
                onClick={handleLogin}
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  padding: { xs: "2px 8px", sm: "4px 10px" },
                }}
              >
                Войти
              </Button>
              {!isMobile && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleRegister}
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    padding: { xs: "2px 8px", sm: "4px 10px" },
                  }}
                >
                  Регистрация
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
