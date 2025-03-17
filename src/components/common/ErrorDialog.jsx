import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Typography } from "@mui/material";

/**
 * Компонент для отображения ошибок в виде диалогового окна
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.open - Флаг открытия диалога
 * @param {Function} props.onClose - Функция закрытия диалога
 * @param {string} props.title - Заголовок диалога
 * @param {string} props.message - Сообщение об ошибке
 * @returns {JSX.Element} Компонент диалогового окна с ошибкой
 */
const ErrorDialog = ({ open, onClose, title = "Ошибка", message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle id="error-dialog-title">
        <Box display="flex" alignItems="center">
          <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Понятно
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
