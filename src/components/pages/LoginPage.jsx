import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "../../context/ThemeContext";

export default function LoginPage() {
  const { login, error, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  // Используем useEffect для перенаправления после авторизации
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Валидация формы
    if (!formData.username || !formData.password) {
      setFormError("Пожалуйста, заполните все поля");
      return;
    }

    try {
      await login(formData);
      // Перенаправление будет выполнено в useEffect
    } catch (err) {
      console.error("Ошибка при входе:", err);
      setFormError(error || "Ошибка при входе. Попробуйте позже.");
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Вход в аккаунт
      </Typography>

      <Paper
        sx={{
          p: isRetroTheme && isMobile ? 2 : 3,
          maxWidth: 500,
          mx: "auto",
          mt: 2,
        }}
      >
        {(formError || error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError || error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Имя пользователя"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />

          <TextField
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Войти"}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Еще нет аккаунта?{" "}
            <MuiLink component={Link} to="/register">
              Зарегистрироваться
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </>
  );
}
