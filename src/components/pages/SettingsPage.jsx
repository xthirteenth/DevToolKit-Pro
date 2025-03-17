import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
} from "@mui/material";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("ru");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleNotificationsChange = (event) => {
    setNotifications(event.target.checked);
  };

  const handleAutoSaveChange = (event) => {
    setAutoSave(event.target.checked);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSaveSettings = () => {
    // Здесь можно добавить логику сохранения настроек
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>

      <Paper sx={{ padding: 3, marginTop: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Общие настройки
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={handleNotificationsChange}
                  name="notificationsSwitch"
                />
              }
              label="Уведомления"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={autoSave}
                  onChange={handleAutoSaveChange}
                  name="autoSaveSwitch"
                />
              }
              label="Автосохранение"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Языковые настройки
            </Typography>
            <FormControl sx={{ minWidth: 200, mt: 1 }}>
              <InputLabel id="language-select-label">
                Язык интерфейса
              </InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                label="Язык интерфейса"
                onChange={handleLanguageChange}
              >
                <MenuItem value="ru">Русский</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
            >
              Сохранить настройки
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Настройки успешно сохранены!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
