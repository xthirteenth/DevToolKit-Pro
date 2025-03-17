import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { useModules } from "../../context/ModulesContext";
import { useNavigate } from "react-router-dom";

export default function ModuleDetailsModal({ open, onClose, moduleId }) {
  const {
    getInstalledModule,
    availableModules,
    installModule,
    uninstallModule,
    isModuleInstalled,
  } = useModules();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Находим модуль по ID
  const module = availableModules.find((m) => m.id === moduleId);

  // Если модуль не найден, не отображаем модальное окно
  if (!module) {
    return null;
  }

  const installed = isModuleInstalled(module.id);

  // Обработчик установки/удаления модуля
  const handleModuleAction = async () => {
    setIsProcessing(true);
    try {
      let success;
      if (installed) {
        success = await uninstallModule(module.id);
      } else {
        success = await installModule(module.id);
      }

      // Если операция успешна, закрываем модальное окно
      if (success) {
        // Добавляем небольшую задержку перед закрытием модального окна
        setTimeout(() => {
          onClose();
        }, 300);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Обработчик перехода на страницу профиля
  const handleGoToProfile = () => {
    onClose();
    // Добавляем небольшую задержку перед переходом на страницу профиля
    setTimeout(() => {
      navigate("/profile");
    }, 300);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="module-details-title"
    >
      <DialogTitle id="module-details-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{module.name}</Typography>
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Категория: {module.category} • Загрузок: {module.downloads}
        </Typography>

        <Typography variant="body1" paragraph>
          {module.description}
        </Typography>

        <Box mb={2}>
          {module.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        <Typography variant="h6" gutterBottom>
          Содержимое модуля
        </Typography>

        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {module.content}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          Закрыть
        </Button>
        {installed && (
          <Button
            onClick={handleGoToProfile}
            disabled={isProcessing}
            color="primary"
          >
            Перейти в профиль
          </Button>
        )}
        <Button
          variant={installed ? "outlined" : "contained"}
          color={installed ? "error" : "primary"}
          startIcon={
            isProcessing ? (
              <CircularProgress size={20} />
            ) : installed ? (
              <DeleteIcon />
            ) : (
              <DownloadIcon />
            )
          }
          onClick={handleModuleAction}
          disabled={isProcessing}
        >
          {installed ? "Удалить" : "Установить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
