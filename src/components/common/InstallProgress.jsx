import React, { useEffect, useState } from "react";
import { LinearProgress, Box } from "@mui/material";
import { useModules } from "../../context/ModulesContext";

const InstallProgress = () => {
  const { isInstalling } = useModules();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInstalling) {
      setVisible(true);
    } else {
      // Небольшая задержка перед скрытием, чтобы показать завершение
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInstalling]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: "30px", sm: "50px" }, // Позиционируем под AppBar
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "opacity 0.3s ease-in-out",
        opacity: isInstalling ? 1 : 0,
      }}
    >
      <LinearProgress
        color="secondary"
        sx={{
          height: 3,
          "& .MuiLinearProgress-bar": {
            transition: "transform 0.5s linear",
          },
        }}
      />
    </Box>
  );
};

export default InstallProgress;
