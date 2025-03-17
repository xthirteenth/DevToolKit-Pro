import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ExtensionIcon from "@mui/icons-material/Extension";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import { useModules } from "../../context/ModulesContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "../../context/ThemeContext";

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser, getUserPassword, changePassword } =
    useAuth();
  const { getAllInstalledModules, installedModules } = useModules();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  // Добавляем состояние загрузки
  const [isLoading, setIsLoading] = useState(true);
  const [userModules, setUserModules] = useState([]);
  const [error, setError] = useState(null);

  // Состояние для отображения пароля
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("••••••••");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Состояние для диалога смены пароля
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Отладочный вывод для проверки данных пользователя
  useEffect(() => {
    if (user) {
      console.log("Данные пользователя:", user);
      console.log("Дата регистрации:", user.createdAt);
    }
  }, [user]);

  // Мемоизируем функцию загрузки данных
  const loadData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Добавляем небольшую задержку, чтобы убедиться, что данные обновились
      setTimeout(() => {
        const modules = getAllInstalledModules();
        setUserModules(modules);
        setError(null);
        setIsLoading(false);
      }, 300);
    } catch (err) {
      console.error("Ошибка при загрузке данных профиля:", err);
      setError(
        "Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже."
      );
      setIsLoading(false);
    }
  }, [isAuthenticated, user, getAllInstalledModules]);

  // Загружаем данные при монтировании компонента и при изменении зависимостей
  useEffect(() => {
    loadData();
  }, [loadData, location.key, installedModules]);

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

  // Отображаем индикатор загрузки
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Отображаем сообщение об ошибке
  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={loadData}
          sx={{ mt: 2 }}
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Не указана";
    }

    try {
      const date = new Date(dateString);

      // Проверка на корректность даты
      if (isNaN(date.getTime())) {
        return "Некорректная дата";
      }

      return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Ошибка при форматировании даты:", error);
      return "Ошибка формата даты";
    }
  };

  // Безопасное получение даты регистрации
  const getRegistrationDate = () => {
    if (!user) return "Не указана";
    if (!user.createdAt) return "Не указана";
    return formatDate(user.createdAt);
  };

  // Обработчик переключения видимости пароля
  const handleTogglePasswordVisibility = async () => {
    if (!showPassword) {
      // Если показываем пароль
      setIsPasswordLoading(true);
      try {
        // Получаем пароль из API
        const userPassword = await getUserPassword();
        if (userPassword) {
          setPassword(userPassword);
        } else {
          // Если не удалось получить пароль, показываем заглушку
          setPassword("password123");
        }
      } catch (error) {
        console.error("Ошибка при получении пароля:", error);
        // В случае ошибки показываем заглушку
        setPassword("password123");
      } finally {
        setIsPasswordLoading(false);
        setShowPassword(true);
      }
    } else {
      // Если скрываем пароль
      setPassword("••••••••");
      setShowPassword(false);
    }
  };

  // Обработчики для диалога смены пароля
  const handleOpenChangePassword = () => {
    setChangePasswordOpen(true);
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    setPasswordError("");
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false);
  };

  const handleChangePassword = async () => {
    // Проверка валидности паролей
    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Пароль должен содержать не менее 6 символов");
      return;
    }

    try {
      // Отправляем запрос на смену пароля
      await changePassword(currentPassword, newPassword);

      // Закрываем диалог
      setChangePasswordOpen(false);

      // Сбрасываем поля
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");

      // Обновляем отображаемый пароль независимо от того, был ли он виден
      setPassword(newPassword);
      // Если пароль был скрыт, показываем его
      if (!showPassword) {
        setShowPassword(true);
      }

      // Показываем уведомление об успешной смене пароля
      alert("Пароль успешно изменен");
    } catch (error) {
      // Обрабатываем ошибки
      if (error.response && error.response.data && error.response.data.msg) {
        setPasswordError(error.response.data.msg);
      } else {
        setPasswordError("Ошибка при смене пароля. Попробуйте позже.");
      }
    }
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
                  secondary={user?.username || "Не указано"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user?.email || "Не указан"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Пароль"
                  secondary={
                    isPasswordLoading ? (
                      <CircularProgress size={16} />
                    ) : (
                      password
                    )
                  }
                />
                <IconButton onClick={handleTogglePasswordVisibility}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleOpenChangePassword}
                  sx={{ ml: 1 }}
                >
                  Сменить пароль
                </Button>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DateRangeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Дата регистрации"
                  secondary={getRegistrationDate()}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ExtensionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Установленные модули"
                  secondary={`${userModules.length} модулей`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Установленные модули */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" gutterBottom>
            Установленные модули
          </Typography>

          {userModules.length === 0 ? (
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
              {userModules.map((module) => (
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
                      <div>
                        {module.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Диалог смены пароля */}
      <Dialog open={changePasswordOpen} onClose={handleCloseChangePassword}>
        <DialogTitle>Смена пароля</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Для смены пароля введите текущий пароль и новый пароль дважды.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Текущий пароль"
            type={showCurrentPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Новый пароль"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Подтвердите новый пароль"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!passwordError}
            helperText={passwordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangePassword}>Отмена</Button>
          <Button onClick={handleChangePassword} color="primary">
            Сменить пароль
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
