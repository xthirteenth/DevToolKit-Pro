import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../../context/ThemeContext";

// Компонент обычного калькулятора
const StandardCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  // Обработка ввода цифр
  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  // Обработка ввода десятичной точки
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // Обработка операторов
  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  // Выполнение расчета
  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (operator === "+") {
      return firstOperand + inputValue;
    } else if (operator === "-") {
      return firstOperand - inputValue;
    } else if (operator === "*") {
      return firstOperand * inputValue;
    } else if (operator === "/") {
      return firstOperand / inputValue;
    }

    return inputValue;
  };

  // Обработка процента
  const handlePercent = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(inputValue / 100));
  };

  // Сброс калькулятора
  const resetCalculator = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  // Очистка текущего ввода
  const clearEntry = () => {
    setDisplay("0");
  };

  // Обработка нажатия на кнопку равно
  const handleEquals = () => {
    if (!operator) return;

    const inputValue = parseFloat(display);
    const result = performCalculation();
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  // Обработка нажатия на кнопку
  const handleButtonClick = (value) => {
    if (value === "C") {
      resetCalculator();
    } else if (value === "CE") {
      clearEntry();
    } else if (value === "=") {
      handleEquals();
    } else if (value === "%") {
      handlePercent();
    } else if (["+", "-", "*", "/"].includes(value)) {
      handleOperator(value);
    } else if (value === ".") {
      inputDecimal();
    } else {
      inputDigit(value);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: isRetroTheme ? 2 : 3,
        marginTop: 2,
        borderRadius: isRetroTheme ? 0 : 2,
        border: isRetroTheme ? "2px solid #000" : "none",
        boxShadow: isRetroTheme ? "none" : undefined,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            disabled
            value={display}
            InputProps={{
              style: {
                fontSize: "1.5rem",
                textAlign: "right",
                backgroundColor: isRetroTheme ? "#e0e0e0" : undefined,
                border: isRetroTheme ? "1px solid #000" : undefined,
                borderRadius: isRetroTheme ? 0 : undefined,
              },
            }}
          />
        </Grid>
        <Grid item container spacing={isMobile ? 1 : 2}>
          {[
            "C",
            "CE",
            "%",
            "/",
            "7",
            "8",
            "9",
            "*",
            "4",
            "5",
            "6",
            "-",
            "1",
            "2",
            "3",
            "+",
            "0",
            ".",
            "=",
            "",
          ].map((btn, index) => {
            if (btn === "") return <Grid item xs={3} key={index} />;

            return (
              <Grid item xs={btn === "0" ? 6 : 3} key={index}>
                <Button
                  fullWidth
                  variant={isRetroTheme ? "outlined" : "contained"}
                  color={
                    ["/", "*", "-", "+", "="].includes(btn)
                      ? "primary"
                      : ["C", "CE", "%"].includes(btn)
                      ? "error"
                      : "secondary"
                  }
                  sx={{
                    height: isMobile ? "40px" : "60px",
                    fontSize: isMobile ? "1rem" : "1.2rem",
                    borderRadius: isRetroTheme ? 0 : undefined,
                    border: isRetroTheme ? "1px solid #000" : undefined,
                  }}
                  onClick={() => handleButtonClick(btn)}
                >
                  {btn}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Paper>
  );
};

// Компонент научного калькулятора
const ScientificCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  // Обработка ввода цифр
  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  // Обработка ввода десятичной точки
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // Обработка операторов
  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  // Выполнение расчета
  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (operator === "+") {
      return firstOperand + inputValue;
    } else if (operator === "-") {
      return firstOperand - inputValue;
    } else if (operator === "*") {
      return firstOperand * inputValue;
    } else if (operator === "/") {
      return firstOperand / inputValue;
    } else if (operator === "^") {
      return Math.pow(firstOperand, inputValue);
    }

    return inputValue;
  };

  // Обработка процента
  const handlePercent = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(inputValue / 100));
  };

  // Сброс калькулятора
  const resetCalculator = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  // Очистка текущего ввода
  const clearEntry = () => {
    setDisplay("0");
  };

  // Обработка нажатия на кнопку равно
  const handleEquals = () => {
    if (!operator) return;

    const inputValue = parseFloat(display);
    const result = performCalculation();
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  // Научные функции
  const handleScientificFunction = (func) => {
    const inputValue = parseFloat(display);
    let result;

    switch (func) {
      case "sin":
        result = Math.sin(inputValue);
        break;
      case "cos":
        result = Math.cos(inputValue);
        break;
      case "tan":
        result = Math.tan(inputValue);
        break;
      case "log":
        result = Math.log10(inputValue);
        break;
      case "ln":
        result = Math.log(inputValue);
        break;
      case "sqrt":
        result = Math.sqrt(inputValue);
        break;
      case "x^2":
        result = Math.pow(inputValue, 2);
        break;
      case "x^3":
        result = Math.pow(inputValue, 3);
        break;
      case "1/x":
        result = 1 / inputValue;
        break;
      case "pi":
        result = Math.PI;
        break;
      case "e":
        result = Math.E;
        break;
      case "+/-":
        result = -inputValue;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setWaitingForSecondOperand(true);
  };

  // Функции памяти
  const handleMemory = (action) => {
    const inputValue = parseFloat(display);

    switch (action) {
      case "MC": // Memory Clear
        setMemory(0);
        break;
      case "MR": // Memory Recall
        setDisplay(String(memory));
        setWaitingForSecondOperand(true);
        break;
      case "M+": // Memory Add
        setMemory(memory + inputValue);
        setWaitingForSecondOperand(true);
        break;
      case "M-": // Memory Subtract
        setMemory(memory - inputValue);
        setWaitingForSecondOperand(true);
        break;
      default:
        break;
    }
  };

  // Обработка нажатия на кнопку
  const handleButtonClick = (value) => {
    if (value === "C") {
      resetCalculator();
    } else if (value === "CE") {
      clearEntry();
    } else if (value === "=") {
      handleEquals();
    } else if (value === "%") {
      handlePercent();
    } else if (["+", "-", "*", "/", "^"].includes(value)) {
      handleOperator(value);
    } else if (value === ".") {
      inputDecimal();
    } else if (
      [
        "sin",
        "cos",
        "tan",
        "log",
        "ln",
        "sqrt",
        "x^2",
        "x^3",
        "1/x",
        "pi",
        "e",
        "+/-",
      ].includes(value)
    ) {
      handleScientificFunction(value);
    } else if (["MC", "MR", "M+", "M-"].includes(value)) {
      handleMemory(value);
    } else {
      inputDigit(value);
    }
  };

  // Кнопки научного калькулятора
  const scientificButtons = [
    "sin",
    "cos",
    "tan",
    "log",
    "ln",
    "sqrt",
    "x^2",
    "x^3",
    "1/x",
    "pi",
    "e",
    "^",
    "MC",
    "MR",
    "M+",
    "M-",
  ];

  // Кнопки обычного калькулятора
  const standardButtons = [
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
    "+/-",
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        padding: isRetroTheme ? 2 : 3,
        marginTop: 2,
        borderRadius: isRetroTheme ? 0 : 2,
        border: isRetroTheme ? "2px solid #000" : "none",
        boxShadow: isRetroTheme ? "none" : undefined,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            disabled
            value={display}
            InputProps={{
              style: {
                fontSize: "1.5rem",
                textAlign: "right",
                backgroundColor: isRetroTheme ? "#e0e0e0" : undefined,
                border: isRetroTheme ? "1px solid #000" : undefined,
                borderRadius: isRetroTheme ? 0 : undefined,
              },
            }}
          />
        </Grid>

        {/* Научные кнопки */}
        <Grid item container spacing={isMobile ? 1 : 2}>
          {scientificButtons.map((btn, index) => (
            <Grid item xs={3} key={`scientific-${index}`}>
              <Button
                fullWidth
                variant={isRetroTheme ? "outlined" : "contained"}
                color={
                  ["^", "MC", "MR", "M+", "M-"].includes(btn)
                    ? "primary"
                    : "info"
                }
                sx={{
                  height: isMobile ? "40px" : "50px",
                  fontSize: isMobile ? "0.7rem" : "0.9rem",
                  borderRadius: isRetroTheme ? 0 : undefined,
                  border: isRetroTheme ? "1px solid #000" : undefined,
                }}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Стандартные кнопки */}
        <Grid item container spacing={isMobile ? 1 : 2}>
          {standardButtons.map((btn, index) => (
            <Grid
              item
              xs={btn === "=" ? 3 : btn === "0" ? 6 : 3}
              key={`standard-${index}`}
            >
              <Button
                fullWidth
                variant={isRetroTheme ? "outlined" : "contained"}
                color={
                  ["/", "*", "-", "+", "=", "^"].includes(btn)
                    ? "primary"
                    : ["C", "CE", "%"].includes(btn)
                    ? "error"
                    : "secondary"
                }
                sx={{
                  height: isMobile ? "40px" : "60px",
                  fontSize: isMobile ? "1rem" : "1.2rem",
                  borderRadius: isRetroTheme ? 0 : undefined,
                  border: isRetroTheme ? "1px solid #000" : undefined,
                }}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

// Компонент программистского калькулятора
const ProgrammerCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [base, setBase] = useState(10); // 2 - двоичная, 8 - восьмеричная, 10 - десятичная, 16 - шестнадцатеричная
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  // Преобразование числа в текущую систему счисления
  const convertToBase = (number) => {
    const num = parseInt(number, 10);
    switch (base) {
      case 2:
        return num.toString(2);
      case 8:
        return num.toString(8);
      case 10:
        return num.toString(10);
      case 16:
        return num.toString(16).toUpperCase();
      default:
        return num.toString(10);
    }
  };

  // Преобразование из текущей системы счисления в десятичную
  const convertFromBase = (number) => {
    return parseInt(number, base);
  };

  // Обработка ввода цифр
  const inputDigit = (digit) => {
    // Проверка допустимости цифры для текущей системы счисления
    if (
      (base === 2 && digit > 1) ||
      (base === 8 && digit > 7) ||
      (base === 16 &&
        ![
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
        ].includes(digit))
    ) {
      return;
    }

    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  // Обработка операторов
  const handleOperator = (nextOperator) => {
    const inputValue = convertFromBase(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(convertToBase(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  // Выполнение расчета
  const performCalculation = () => {
    const inputValue = convertFromBase(display);

    if (operator === "+") {
      return firstOperand + inputValue;
    } else if (operator === "-") {
      return firstOperand - inputValue;
    } else if (operator === "*") {
      return firstOperand * inputValue;
    } else if (operator === "/") {
      return Math.floor(firstOperand / inputValue);
    } else if (operator === "AND") {
      return firstOperand & inputValue;
    } else if (operator === "OR") {
      return firstOperand | inputValue;
    } else if (operator === "XOR") {
      return firstOperand ^ inputValue;
    } else if (operator === "<<") {
      return firstOperand << inputValue;
    } else if (operator === ">>") {
      return firstOperand >> inputValue;
    } else if (operator === "MOD") {
      return firstOperand % inputValue;
    }

    return inputValue;
  };

  // Сброс калькулятора
  const resetCalculator = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  // Очистка текущего ввода
  const clearEntry = () => {
    setDisplay("0");
  };

  // Обработка нажатия на кнопку равно
  const handleEquals = () => {
    if (!operator) return;

    const result = performCalculation();
    setDisplay(convertToBase(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  // Обработка битовых операций
  const handleBitwiseOperation = (operation) => {
    const inputValue = convertFromBase(display);
    let result;

    switch (operation) {
      case "NOT":
        result = ~inputValue;
        break;
      case "1s":
        result = inputValue === 0 ? 1 : 0;
        break;
      default:
        result = inputValue;
    }

    setDisplay(convertToBase(result));
    setWaitingForSecondOperand(true);
  };

  // Изменение системы счисления
  const changeBase = (newBase) => {
    if (base === newBase) return;

    // Преобразуем текущее число в десятичную систему
    const decimalValue = convertFromBase(display);
    // Затем преобразуем в новую систему счисления
    setBase(newBase);
    setDisplay(convertToBase(decimalValue));
  };

  // Обработка нажатия на кнопку
  const handleButtonClick = (value) => {
    if (value === "C") {
      resetCalculator();
    } else if (value === "CE") {
      clearEntry();
    } else if (value === "=") {
      handleEquals();
    } else if (
      ["+", "-", "*", "/", "AND", "OR", "XOR", "<<", ">>", "MOD"].includes(
        value
      )
    ) {
      handleOperator(value);
    } else if (["NOT", "1s"].includes(value)) {
      handleBitwiseOperation(value);
    } else if (["BIN", "OCT", "DEC", "HEX"].includes(value)) {
      const baseMap = { BIN: 2, OCT: 8, DEC: 10, HEX: 16 };
      changeBase(baseMap[value]);
    } else {
      inputDigit(value);
    }
  };

  // Получение доступных кнопок в зависимости от системы счисления
  const getAvailableButtons = () => {
    const buttons = ["0", "1"];

    if (base >= 8) {
      buttons.push("2", "3", "4", "5", "6", "7");
    }

    if (base >= 10) {
      buttons.push("8", "9");
    }

    if (base === 16) {
      buttons.push("A", "B", "C", "D", "E", "F");
    }

    return buttons;
  };

  // Кнопки для выбора системы счисления
  const baseButtons = ["BIN", "OCT", "DEC", "HEX"];

  // Кнопки для битовых операций
  const bitwiseButtons = ["AND", "OR", "XOR", "NOT", "<<", ">>", "MOD", "1s"];

  // Доступные цифровые кнопки
  const availableButtons = getAvailableButtons();

  return (
    <Paper
      elevation={3}
      sx={{
        padding: isRetroTheme ? 2 : 3,
        marginTop: 2,
        borderRadius: isRetroTheme ? 0 : 2,
        border: isRetroTheme ? "2px solid #000" : "none",
        boxShadow: isRetroTheme ? "none" : undefined,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            disabled
            value={display}
            InputProps={{
              style: {
                fontSize: "1.5rem",
                textAlign: "right",
                backgroundColor: isRetroTheme ? "#e0e0e0" : undefined,
                border: isRetroTheme ? "1px solid #000" : undefined,
                borderRadius: isRetroTheme ? 0 : undefined,
                fontFamily: "monospace",
              },
            }}
          />
        </Grid>

        {/* Кнопки выбора системы счисления */}
        <Grid item container spacing={isMobile ? 1 : 2}>
          {baseButtons.map((btn, index) => (
            <Grid item xs={3} key={`base-${index}`}>
              <Button
                fullWidth
                variant={
                  base === { BIN: 2, OCT: 8, DEC: 10, HEX: 16 }[btn]
                    ? "contained"
                    : isRetroTheme
                    ? "outlined"
                    : "contained"
                }
                color={
                  base === { BIN: 2, OCT: 8, DEC: 10, HEX: 16 }[btn]
                    ? "success"
                    : "primary"
                }
                sx={{
                  height: isMobile ? "40px" : "50px",
                  fontSize: isMobile ? "0.7rem" : "0.9rem",
                  borderRadius: isRetroTheme ? 0 : undefined,
                  border: isRetroTheme ? "1px solid #000" : undefined,
                }}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Битовые операции */}
        <Grid item container spacing={isMobile ? 1 : 2}>
          {bitwiseButtons.map((btn, index) => (
            <Grid item xs={3} key={`bitwise-${index}`}>
              <Button
                fullWidth
                variant={isRetroTheme ? "outlined" : "contained"}
                color="info"
                sx={{
                  height: isMobile ? "40px" : "50px",
                  fontSize: isMobile ? "0.7rem" : "0.9rem",
                  borderRadius: isRetroTheme ? 0 : undefined,
                  border: isRetroTheme ? "1px solid #000" : undefined,
                }}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Цифровые кнопки и операции */}
        <Grid item container spacing={isMobile ? 1 : 2}>
          {/* Цифровые кнопки */}
          <Grid item container xs={9} spacing={isMobile ? 1 : 2}>
            {availableButtons.map((btn, index) => (
              <Grid item xs={4} key={`digit-${index}`}>
                <Button
                  fullWidth
                  variant={isRetroTheme ? "outlined" : "contained"}
                  color="secondary"
                  sx={{
                    height: isMobile ? "40px" : "60px",
                    fontSize: isMobile ? "1rem" : "1.2rem",
                    borderRadius: isRetroTheme ? 0 : undefined,
                    border: isRetroTheme ? "1px solid #000" : undefined,
                  }}
                  onClick={() => handleButtonClick(btn)}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Операции */}
          <Grid item container xs={3} spacing={isMobile ? 1 : 2}>
            {["+", "-", "*", "/", "=", "C"].map((btn, index) => (
              <Grid item xs={12} key={`op-${index}`}>
                <Button
                  fullWidth
                  variant={isRetroTheme ? "outlined" : "contained"}
                  color={btn === "C" ? "error" : "primary"}
                  sx={{
                    height: isMobile ? "40px" : "50px",
                    fontSize: isMobile ? "1rem" : "1.2rem",
                    borderRadius: isRetroTheme ? 0 : undefined,
                    border: isRetroTheme ? "1px solid #000" : undefined,
                  }}
                  onClick={() => handleButtonClick(btn)}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Основной компонент страницы калькулятора
const CalculatorPage = () => {
  const [calculatorType, setCalculatorType] = useState("standard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentTheme } = useThemeContext();
  const isRetroTheme = currentTheme === "retro";

  // Обработчик изменения типа калькулятора
  const handleCalculatorTypeChange = (event) => {
    setCalculatorType(event.target.value);
  };

  // Отображение выбранного калькулятора
  const renderCalculator = () => {
    switch (calculatorType) {
      case "standard":
        return <StandardCalculator />;
      case "scientific":
        return <ScientificCalculator />;
      case "programmer":
        return <ProgrammerCalculator />;
      // Здесь будут добавлены другие типы калькуляторов
      default:
        return <StandardCalculator />;
    }
  };

  return (
    <Box sx={{ padding: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom>
        Калькулятор
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: isRetroTheme ? 2 : 3,
          marginBottom: 2,
          borderRadius: isRetroTheme ? 0 : 2,
          border: isRetroTheme ? "2px solid #000" : "none",
          boxShadow: isRetroTheme ? "none" : undefined,
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="calculator-type-label">Тип калькулятора</InputLabel>
          <Select
            labelId="calculator-type-label"
            id="calculator-type"
            value={calculatorType}
            label="Тип калькулятора"
            onChange={handleCalculatorTypeChange}
            sx={{
              borderRadius: isRetroTheme ? 0 : undefined,
              border: isRetroTheme ? "1px solid #000" : undefined,
            }}
          >
            <MenuItem value="standard">Обычный калькулятор</MenuItem>
            <MenuItem value="scientific">Научный калькулятор</MenuItem>
            <MenuItem value="programmer">Программистский калькулятор</MenuItem>
            {/* Здесь будут добавлены другие типы калькуляторов */}
          </Select>
        </FormControl>
      </Paper>

      {renderCalculator()}
    </Box>
  );
};

export default CalculatorPage;
