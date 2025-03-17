import React, { useState, useEffect } from "react";
import { Snackbar, Button, Box, Typography } from "@mui/material";
import CookieIcon from "@mui/icons-material/Cookie";

// Функция для установки куки
const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
};

// Функция для получения значения куки
const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже показано уведомление о куки
    const cookieConsent = getCookie("cookieConsent");
    if (!cookieConsent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie("cookieConsent", "true");
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        "& .MuiPaper-root": {
          maxWidth: "600px",
          width: "100%",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          width: "100%",
        }}
      >
        <CookieIcon
          sx={{
            mr: { xs: 0, sm: 2 },
            mb: { xs: 1, sm: 0 },
            color: "primary.main",
          }}
        />
        <Typography variant="body2" sx={{ flex: 1, mb: { xs: 1, sm: 0 } }}>
          Мы используем куки для сохранения ваших настроек и предпочтений, чтобы
          сделать ваш опыт использования приложения более удобным.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAccept}
          sx={{ ml: { xs: 0, sm: 2 } }}
        >
          Понятно
        </Button>
      </Box>
    </Snackbar>
  );
};

export default CookieConsent;
