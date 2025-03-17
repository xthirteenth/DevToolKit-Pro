import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useModules } from "../../context/ModulesContext";
import InstallProgress from "../common/InstallProgress";
import ModuleDetailsModal from "../common/ModuleDetailsModal";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

// Примеры модулей для демонстрации
const exampleModules = [
  {
    id: 1,
    name: "CSS Flexbox Snippets",
    description: "Коллекция готовых шаблонов CSS Flexbox для различных макетов",
    category: "CSS",
    downloads: 1245,
    tags: ["css", "flexbox", "layout"],
  },
  {
    id: 2,
    name: "React Hooks Collection",
    description: "Набор полезных пользовательских хуков для React приложений",
    category: "React",
    downloads: 987,
    tags: ["react", "hooks", "javascript"],
  },
  {
    id: 3,
    name: "CSS Grid Templates",
    description: "Готовые шаблоны CSS Grid для создания адаптивных сеток",
    category: "CSS",
    downloads: 856,
    tags: ["css", "grid", "responsive"],
  },
  {
    id: 4,
    name: "JavaScript Utility Functions",
    description: "Коллекция полезных функций JavaScript для работы с данными",
    category: "JavaScript",
    downloads: 1532,
    tags: ["javascript", "utility", "functions"],
  },
];

export default function ModulesPage() {
  const {
    availableModules,
    installModule,
    uninstallModule,
    isModuleInstalled,
  } = useModules();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingModules, setProcessingModules] = useState(new Set());
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Фильтрация модулей по поисковому запросу
  const filteredModules = availableModules.filter(
    (module) =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Обработчик изменения поискового запроса
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Обработчик установки/удаления модуля
  const handleModuleAction = async (moduleId) => {
    // Добавляем модуль в список обрабатываемых
    setProcessingModules((prev) => new Set(prev).add(moduleId));

    try {
      let success;
      if (isModuleInstalled(moduleId)) {
        success = await uninstallModule(moduleId);
      } else {
        success = await installModule(moduleId);
      }

      // Если операция успешна и пользователь хочет перейти в профиль
      if (success) {
        // Добавляем небольшую задержку для обновления состояния
        setTimeout(() => {
          // Удаляем модуль из списка обрабатываемых
          setProcessingModules((prev) => {
            const newSet = new Set(prev);
            newSet.delete(moduleId);
            return newSet;
          });
        }, 300);
      }
    } catch (error) {
      console.error("Ошибка при обработке модуля:", error);
    } finally {
      // Удаляем модуль из списка обрабатываемых
      setProcessingModules((prev) => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
    }
  };

  // Обработчик открытия модального окна
  const handleOpenModal = (moduleId) => {
    setSelectedModuleId(moduleId);
    setIsModalOpen(true);
  };

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Обработчик перехода на страницу профиля
  const handleGoToProfile = () => {
    setIsRedirecting(true);
    // Добавляем небольшую задержку перед переходом на страницу профиля
    setTimeout(() => {
      navigate("/profile");
    }, 300);
  };

  // Если происходит перенаправление, показываем индикатор загрузки
  if (isRedirecting) {
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

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Модули
      </Typography>

      <Typography variant="body1" paragraph>
        Здесь вы можете найти и установить модули для быстрого доступа к часто
        используемым фрагментам кода, шаблонам и другим ресурсам.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Поиск модулей..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Индикатор прогресса установки */}
      <InstallProgress />

      <Grid container spacing={3}>
        {filteredModules.map((module) => {
          const installed = isModuleInstalled(module.id);
          const isProcessing = processingModules.has(module.id);

          return (
            <Grid item xs={12} md={6} key={module.id}>
              <Card
                sx={{
                  height: "100%",
                  borderLeft: installed ? "4px solid" : "none",
                  borderColor: "secondary.main",
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="h6" component="div">
                      {module.name}
                      {installed && (
                        <CheckCircleIcon
                          color="secondary"
                          fontSize="small"
                          sx={{ ml: 1, verticalAlign: "middle" }}
                        />
                      )}
                    </Typography>
                  }
                  subheader={`Категория: ${module.category} • Загрузок: ${module.downloads}`}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
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
                <CardActions>
                  <Button
                    variant={installed ? "outlined" : "contained"}
                    color={installed ? "error" : "primary"}
                    startIcon={
                      isProcessing ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : installed ? (
                        <DeleteIcon />
                      ) : (
                        <DownloadIcon />
                      )
                    }
                    size="small"
                    onClick={() => handleModuleAction(module.id)}
                    disabled={isProcessing}
                  >
                    {installed ? "Удалить" : "Установить"}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleOpenModal(module.id)}
                    disabled={isProcessing}
                  >
                    Подробнее
                  </Button>
                  {installed && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={handleGoToProfile}
                      disabled={isProcessing}
                    >
                      В профиль
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Модальное окно с подробной информацией о модуле */}
      <ModuleDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        moduleId={selectedModuleId}
      />
    </>
  );
}
