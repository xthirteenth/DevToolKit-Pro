import React, { useState } from "react";
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
import { useModules } from "../../context/ModulesContext";
import InstallProgress from "../common/InstallProgress";

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

  const [searchTerm, setSearchTerm] = useState("");

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
  const handleModuleAction = (moduleId) => {
    if (isModuleInstalled(moduleId)) {
      uninstallModule(moduleId);
    } else {
      installModule(moduleId);
    }
  };

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
                    startIcon={installed ? <DeleteIcon /> : <DownloadIcon />}
                    size="small"
                    onClick={() => handleModuleAction(module.id)}
                  >
                    {installed ? "Удалить" : "Установить"}
                  </Button>
                  <Button size="small">Подробнее</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
