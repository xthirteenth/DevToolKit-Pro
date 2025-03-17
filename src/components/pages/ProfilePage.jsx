import React from "react";
import {
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ExtensionIcon from "@mui/icons-material/Extension";
import { useAuth } from "../../context/AuthContext";
import { useModules } from "../../context/ModulesContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "../../context/ThemeContext";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getAllInstalledModules } = useModules();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  // Получаем установленные модули
  const installedModules = getAllInstalledModules();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Для просмотра профиля необходимо авторизоваться
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{ mt: 2 }}
        >
          Войти
        </Button>
      </Box>
    );
  }

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Профиль
      </Typography>

      <Grid container spacing={3}>
        {/* Информация о пользователе */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: isRetroTheme && isMobile ? 2 : 3,
              mb: isRetroTheme && isMobile ? 2 : 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" component="h2">
                {user?.username}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Имя пользователя"
                  secondary={user?.username}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={user?.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DateRangeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Дата регистрации"
                  secondary={formatDate(user?.createdAt)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ExtensionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Установленные модули"
                  secondary={`${installedModules.length} модулей`}
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                color="error"
                onClick={logout}
                fullWidth
              >
                Выйти из аккаунта
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Установленные модули */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" gutterBottom>
            Установленные модули
          </Typography>

          {installedModules.length === 0 ? (
            <Paper
              sx={{
                p: isRetroTheme && isMobile ? 2 : 3,
                textAlign: "center",
              }}
            >
              <Typography variant="body1" paragraph>
                У вас пока нет установленных модулей
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/modules")}
              >
                Перейти к модулям
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {installedModules.map((module) => (
                <Grid item xs={12} key={module.id}>
                  <Card>
                    <CardHeader
                      title={module.name}
                      subheader={`Категория: ${module.category}`}
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {module.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {module.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}
