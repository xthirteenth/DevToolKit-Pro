import React, { useState, useEffect, useContext } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { useModules } from "../../context/ModulesContext";
import InstallProgress from "../common/InstallProgress";
import ModuleDetailsModal from "../common/ModuleDetailsModal";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, TAGS } from "../../models/Module";

// Доступные языки и фреймворки для фильтрации
const availableFilters = [
  // Языки программирования
  "JavaScript",
  "TypeScript",
  "Python",
  "C++",
  "C",
  "Rust",
  "R",
  "Ruby",
  "Solidity",
  "Java",
  "C#",
  "Go",
  // Фреймворки и библиотеки
  "React",
  "CSS",
  "PyTorch",
  "Tailwind",
  "Node.js",
  "Express",
  "Matplotlib",
];

export default function ModulesPage() {
  const {
    availableModules,
    installModule,
    uninstallModule,
    isModuleInstalled,
    isLoadingModules,
  } = useModules();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingModules, setProcessingModules] = useState(new Set());
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Отладочный вывод для проверки доступных модулей
  useEffect(() => {
    console.log("Доступные модули:", availableModules);
  }, [availableModules]);

  // Фильтрация модулей
  const filteredModules = availableModules.filter((module) => {
    // Проверка наличия необходимых свойств
    if (!module || !module.name || !module.description) {
      console.warn("Некорректный модуль:", module);
      return false;
    }

    // Фильтр по поисковому запросу
    const matchesSearch =
      searchTerm === "" ||
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Фильтр по категории
    const matchesCategory =
      selectedCategory === "" || module.category === selectedCategory;

    // Фильтр по тегам (с проверкой наличия тегов)
    const matchesTags =
      selectedTags.length === 0 ||
      (module.tags && selectedTags.some((tag) => module.tags.includes(tag)));

    return matchesSearch && matchesCategory && matchesTags;
  });

  // Сортировка модулей
  const sortedModules = [...filteredModules].sort((a, b) => {
    if (sortBy === "downloads") {
      return (b.downloads || 0) - (a.downloads || 0);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Обработчик изменения поискового запроса
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Обработчик изменения тегов
  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Доступные модули
      </Typography>

      {/* Фильтры и поиск */}
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Поиск модулей"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Категория</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Категория"
              >
                <MenuItem value="">Все категории</MenuItem>
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Сортировка"
              >
                <MenuItem value="name">По названию</MenuItem>
                <MenuItem value="downloads">По популярности</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedTags([]);
                setSortBy("name");
              }}
              sx={{ height: "100%" }}
            >
              Сбросить
            </Button>
          </Grid>
        </Grid>

        {/* Теги */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Теги:
          </Typography>
          <FormControl sx={{ width: "100%" }}>
            <Select
              multiple
              displayEmpty
              value={selectedTags}
              onChange={handleTagChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Выберите теги</em>;
                }
                return selected.join(", ");
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250,
                  },
                },
              }}
            >
              {TAGS.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                  <ListItemText primary={tag} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Индикатор прогресса установки */}
      <InstallProgress />

      {/* Отображение индикатора загрузки */}
      {isLoadingModules ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        // Отображение модулей
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {sortedModules.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">Модули не найдены</Typography>
                <Typography variant="body2" color="text.secondary">
                  Попробуйте изменить параметры поиска или фильтры
                </Typography>
              </Paper>
            </Grid>
          ) : (
            sortedModules.map((module) => {
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
                      subheader={`Категория: ${
                        module.category || "Не указана"
                      } • Загрузок: ${module.downloads || 0}`}
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
                        {module.tags &&
                          module.tags.map((tag) => (
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
            })
          )}
        </Grid>
      )}

      {/* Модальное окно с подробной информацией о модуле */}
      <ModuleDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        moduleId={selectedModuleId}
      />
    </Container>
  );
}
