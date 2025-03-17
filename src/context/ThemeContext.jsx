import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Функция для установки куки
const setCookie = (name, value, days = 365) => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
};

// Функция для получения значения куки
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Создаем контекст темы
export const ThemeContext = createContext({
  currentTheme: "system", // 'system', 'dark', 'light', 'retro'
  toggleTheme: () => {},
});

// Хук для использования контекста темы
export const useThemeContext = () => useContext(ThemeContext);

// Определяем темы
const getThemeOptions = (mode) => {
  // Стандартная светлая/темная тема
  if (mode === "light" || mode === "dark") {
    return {
      palette: {
        mode,
        primary: {
          main: mode === "light" ? "#3f51b5" : "#90caf9",
        },
        secondary: {
          main: mode === "light" ? "#f50057" : "#f48fb1",
        },
        background: {
          default: mode === "light" ? "#f5f5f5" : "#121212",
          paper: mode === "light" ? "#ffffff" : "#1e1e1e",
        },
      },
    };
  }

  // Тема "старой игровой приставки"
  if (mode === "retro") {
    return {
      palette: {
        mode: "dark",
        primary: {
          main: "#33ff33", // Яркий зеленый, как на старых мониторах
        },
        secondary: {
          main: "#ff5533", // Оранжево-красный для акцентов
        },
        background: {
          default: "#001100", // Темно-зеленый фон
          paper: "#002200", // Чуть светлее для карточек
        },
        text: {
          primary: "#33ff33", // Зеленый текст
          secondary: "#22bb22", // Более темный зеленый для вторичного текста
        },
      },
      typography: {
        // Используем только Roboto Mono для мобильных устройств, чтобы избежать проблем с шириной
        fontFamily: '"Roboto Mono", monospace',
        fontSize: {
          xs: 10,
          sm: 12,
          md: 12,
        },
        h1: {
          // На мобильных используем Roboto Mono вместо Press Start 2P
          fontFamily: {
            xs: '"Roboto Mono", monospace',
            sm: '"Press Start 2P", "Roboto Mono", monospace',
          },
          fontSize: { xs: "1.3rem", sm: "1.8rem", md: "2.2rem" },
          letterSpacing: { xs: "-0.05em", sm: "normal" }, // Уменьшаем межбуквенное расстояние на мобильных
        },
        h2: {
          fontFamily: {
            xs: '"Roboto Mono", monospace',
            sm: '"Press Start 2P", "Roboto Mono", monospace',
          },
          fontSize: { xs: "1.2rem", sm: "1.6rem", md: "2rem" },
          letterSpacing: { xs: "-0.05em", sm: "normal" },
        },
        h3: {
          fontFamily: {
            xs: '"Roboto Mono", monospace',
            sm: '"Press Start 2P", "Roboto Mono", monospace',
          },
          fontSize: { xs: "1.1rem", sm: "1.4rem", md: "1.8rem" },
          letterSpacing: { xs: "-0.05em", sm: "normal" },
        },
        h4: {
          fontFamily: {
            xs: '"Roboto Mono", monospace',
            sm: '"Press Start 2P", "Roboto Mono", monospace',
          },
          fontSize: { xs: "1rem", sm: "1.2rem", md: "1.6rem" },
          letterSpacing: { xs: "-0.05em", sm: "normal" },
        },
        h5: {
          fontFamily: {
            xs: '"Roboto Mono", monospace',
            sm: '"Press Start 2P", "Roboto Mono", monospace',
          },
          fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.4rem" },
          letterSpacing: { xs: "-0.05em", sm: "normal" },
        },
        h6: {
          fontFamily: {
            xs: '"Roboto Mono", monospace',
            sm: '"Press Start 2P", "Roboto Mono", monospace',
          },
          fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
          letterSpacing: { xs: "-0.05em", sm: "normal" },
        },
        body1: {
          fontFamily: '"Roboto Mono", monospace',
          letterSpacing: { xs: "-0.03em", sm: "0.02em" },
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
        },
        body2: {
          fontFamily: '"Roboto Mono", monospace',
          letterSpacing: { xs: "-0.03em", sm: "0.02em" },
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
        },
        button: {
          fontFamily: {
            xs: '"Roboto Mono", monospace',
            sm: '"Press Start 2P", "Roboto Mono", monospace',
          },
          fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
          letterSpacing: { xs: "-0.05em", sm: "normal" },
        },
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: {
                xs: "none", // Убираем фоновую сетку на мобильных для экономии места
                sm: "linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px)",
              },
              backgroundSize: "20px 20px",
              boxShadow: "0 0 10px rgba(51, 255, 51, 0.3)",
              borderRadius: 0,
              // Уменьшаем отступы на мобильных
              padding: { xs: "8px", sm: "16px" },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              textTransform: "uppercase",
              fontFamily: {
                xs: '"Roboto Mono", monospace',
                sm: '"Press Start 2P", "Roboto Mono", monospace',
              },
              boxShadow: "0 0 5px rgba(51, 255, 51, 0.5)",
              padding: { xs: "4px 8px", sm: "6px 12px", md: "8px 16px" },
              fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
              "&:hover": {
                boxShadow: "0 0 15px rgba(51, 255, 51, 0.8)",
              },
            },
            // Делаем кнопки более компактными на мобильных
            sizeSmall: {
              padding: { xs: "2px 4px", sm: "4px 8px" },
              fontSize: { xs: "0.5rem", sm: "0.6rem" },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              border: "2px solid #33ff33",
              boxShadow: "0 0 10px rgba(51, 255, 51, 0.3)",
              // Уменьшаем отступы на мобильных
              padding: { xs: 0, sm: "inherit" },
            },
          },
        },
        MuiCardContent: {
          styleOverrides: {
            root: {
              padding: { xs: "8px", sm: "16px" },
              "&:last-child": {
                paddingBottom: { xs: "8px", sm: "16px" },
              },
            },
          },
        },
        MuiCardHeader: {
          styleOverrides: {
            root: {
              padding: { xs: "8px", sm: "16px" },
            },
            title: {
              fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
              fontFamily: {
                xs: '"Roboto Mono", monospace',
                sm: '"Press Start 2P", "Roboto Mono", monospace',
              },
            },
            subheader: {
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: "linear-gradient(to right, #001100, #002200)",
              boxShadow: "0 0 10px rgba(51, 255, 51, 0.5)",
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundImage: "linear-gradient(to bottom, #001100, #002200)",
              borderRight: "1px solid #33ff33",
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              "&:hover": {
                backgroundColor: "rgba(51, 255, 51, 0.1)",
              },
              "&.Mui-selected": {
                backgroundColor: "rgba(51, 255, 51, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(51, 255, 51, 0.3)",
                },
              },
              // Делаем пункты меню более компактными на мобильных
              padding: { xs: "4px 8px", sm: "8px 16px" },
            },
          },
        },
        MuiListItemIcon: {
          styleOverrides: {
            root: {
              minWidth: { xs: "32px", sm: "40px" },
            },
          },
        },
        MuiListItemText: {
          styleOverrides: {
            primary: {
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              // На мобильных используем обычный шрифт
              fontFamily: {
                xs: '"Roboto Mono", monospace',
                sm: '"Press Start 2P", "Roboto Mono", monospace',
              },
            },
          },
        },
        MuiContainer: {
          styleOverrides: {
            root: {
              paddingLeft: { xs: 4, sm: 8, md: 16 },
              paddingRight: { xs: 4, sm: 8, md: 16 },
            },
          },
        },
        // Уменьшаем отступы в сетке на мобильных
        MuiGrid: {
          styleOverrides: {
            container: {
              spacing: { xs: 1, sm: 2, md: 3 },
            },
            item: {
              padding: { xs: "4px", sm: "8px", md: "12px" },
            },
          },
        },
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
      },
    };
  }
};

// Провайдер темы
export const ThemeProvider = ({ children }) => {
  // Получаем сохраненную тему из куки или используем темную тему по умолчанию
  const savedTheme = getCookie("theme");
  const [currentTheme, setCurrentTheme] = useState(savedTheme || "dark");
  const prefersDarkMode =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;

  // Сохраняем тему в куки при изменении
  useEffect(() => {
    setCookie("theme", currentTheme);
  }, [currentTheme]);

  // Определяем текущий режим темы
  const getActualMode = () => {
    if (currentTheme === "system") {
      return prefersDarkMode ? "dark" : "light";
    }
    return currentTheme;
  };

  // Создаем тему
  const theme = useMemo(() => {
    const mode = getActualMode();
    return createTheme(getThemeOptions(mode));
  }, [currentTheme, prefersDarkMode]);

  // Функция для переключения темы в новом порядке
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => {
      if (prevTheme === "dark") return "light";
      if (prevTheme === "light") return "retro";
      if (prevTheme === "retro") return "dark";
      return "dark"; // Для любых других значений возвращаем темную тему
    });
  };

  const contextValue = useMemo(
    () => ({
      currentTheme,
      toggleTheme,
    }),
    [currentTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
