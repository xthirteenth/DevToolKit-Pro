import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CodeIcon from "@mui/icons-material/Code";
import SpeedIcon from "@mui/icons-material/Speed";
import ExtensionIcon from "@mui/icons-material/Extension";
import BuildIcon from "@mui/icons-material/Build";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useThemeContext } from "../../context/ThemeContext";
import { useModules } from "../../context/ModulesContext";

export default function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";
  const { getAllInstalledModules } = useModules();

  // Получаем все установленные модули
  const installedModules = getAllInstalledModules();
  const hasInstalledModules = installedModules.length > 0;

  const features = [
    {
      icon: <CodeIcon fontSize="large" color="primary" />,
      title: "Фрагменты кода",
      description:
        "Быстрый доступ к часто используемым фрагментам кода и шаблонам для различных языков программирования.",
    },
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: "Повышение продуктивности",
      description:
        "Ускорьте свой рабочий процесс с помощью готовых решений и инструментов для разработки.",
    },
    {
      icon: <ExtensionIcon fontSize="large" color="primary" />,
      title: "Модульная система",
      description:
        "Устанавливайте только те модули, которые вам нужны, и настраивайте их под свои потребности.",
    },
    {
      icon: <BuildIcon fontSize="large" color="primary" />,
      title: "Инструменты разработчика",
      description:
        "Полезные утилиты для форматирования, валидации и оптимизации кода прямо в вашем браузере.",
    },
  ];

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          mb: isRetroTheme && isMobile ? 1 : { xs: 2, sm: 4 },
          mt: isRetroTheme && isMobile ? 0 : { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            marginBottom: isRetroTheme && isMobile ? "0.25em" : "0.5em",
            fontSize:
              isRetroTheme && isMobile
                ? "1.5rem"
                : { xs: "2rem", sm: "2.5rem" },
          }}
        >
          DevToolkit Pro
        </Typography>

        {!hasInstalledModules && (
          <>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: isRetroTheme && isMobile ? 1 : { xs: 2, sm: 3 },
                fontSize:
                  isRetroTheme && isMobile
                    ? "0.8rem"
                    : { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Ваш универсальный помощник для разработки программного обеспечения
            </Typography>

            <Button
              variant="contained"
              size={isRetroTheme && isMobile ? "small" : "large"}
              onClick={() => navigate("/modules")}
              sx={{ mt: isRetroTheme && isMobile ? 0.5 : 2 }}
            >
              Начать работу с модулями
            </Button>
          </>
        )}
      </Box>

      {!hasInstalledModules ? (
        // Отображаем стандартные блоки, если нет установленных модулей
        <Grid
          container
          spacing={isRetroTheme && isMobile ? 1 : { xs: 2, sm: 3 }}
        >
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: isRetroTheme && isMobile ? 1 : { xs: 2, sm: 3 },
                  }}
                >
                  <Box
                    sx={{
                      mb: isRetroTheme && isMobile ? 0.5 : { xs: 1, sm: 2 },
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      fontSize: isRetroTheme && isMobile ? "medium" : "large",
                    })}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      marginBottom:
                        isRetroTheme && isMobile ? "0.25em" : "0.5em",
                      fontSize:
                        isRetroTheme && isMobile
                          ? "1rem"
                          : { xs: "1.25rem", sm: "1.5rem" },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize:
                        isRetroTheme && isMobile
                          ? "0.75rem"
                          : { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Отображаем установленные модули
        <Box>
          {installedModules.map((module) => (
            <Paper
              key={module.id}
              elevation={2}
              sx={{
                p: isRetroTheme && isMobile ? 2 : 3,
                mb: isRetroTheme && isMobile ? 2 : 3,
                borderLeft: "4px solid",
                borderColor: "secondary.main",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontSize:
                      isRetroTheme && isMobile
                        ? "1.2rem"
                        : { xs: "1.5rem", sm: "1.8rem" },
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    pb: 1,
                  }}
                >
                  {module.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontSize:
                      isRetroTheme && isMobile
                        ? "0.75rem"
                        : { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {module.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  "& pre": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.2)"
                        : "rgba(0, 0, 0, 0.05)",
                    p: 2,
                    borderRadius: 1,
                    overflowX: "auto",
                    fontSize:
                      isRetroTheme && isMobile
                        ? "0.7rem"
                        : { xs: "0.8rem", sm: "0.9rem" },
                  },
                  "& h2, & h3": {
                    fontSize:
                      isRetroTheme && isMobile
                        ? "1rem"
                        : { xs: "1.2rem", sm: "1.4rem" },
                    mt: 2,
                    mb: 1,
                  },
                }}
              >
                {module.content}
              </Box>

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  variant="outlined"
                  size={isRetroTheme && isMobile ? "small" : "medium"}
                  onClick={() => navigate("/modules")}
                >
                  Управление модулями
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </>
  );
}
