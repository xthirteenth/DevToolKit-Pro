import React from "react";
import { Box, Typography, Paper, Grid, TextField, Button } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";

const CalculatorPage = () => {
  const { theme } = useThemeContext();

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Калькулятор
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Результат"
              variant="outlined"
              disabled
              value="0"
            />
          </Grid>
          <Grid item container spacing={1}>
            {[
              "7",
              "8",
              "9",
              "/",
              "C",
              "4",
              "5",
              "6",
              "*",
              "CE",
              "1",
              "2",
              "3",
              "-",
              "=",
              "0",
              ".",
              "%",
              "+",
            ].map((btn) => (
              <Grid item xs={btn === "=" ? 3 : btn === "0" ? 6 : 3} key={btn}>
                <Button
                  fullWidth
                  variant="contained"
                  color={
                    ["/", "*", "-", "+", "="].includes(btn)
                      ? "primary"
                      : ["C", "CE", "%"].includes(btn)
                      ? "error"
                      : "secondary"
                  }
                  sx={{ height: "50px" }}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CalculatorPage;
