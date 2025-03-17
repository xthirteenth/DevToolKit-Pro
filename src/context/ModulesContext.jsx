import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import ErrorDialog from "../components/common/ErrorDialog";

// API URL
const API_URL = "http://localhost:5000/api";

// Функция для установки куки
const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
};

// Функция для получения значения куки
const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Примеры модулей для демонстрации
export const exampleModules = [
  {
    id: 1,
    name: "HTML Elements Reference",
    description:
      "Краткий справочник HTML-элементов и типовая структура документа",
    category: "HTML",
    downloads: 1245,
    tags: ["html", "elements", "structure"],
    content: (
      <>
        <h2>HTML Elements Reference</h2>
        <p>Основные HTML-элементы и их краткое описание:</p>

        <h3>Структурные элементы</h3>
        <pre>
          {`<!DOCTYPE html> - объявление типа документа
<html> - корневой элемент
<head> - метаданные документа
<body> - содержимое документа
<header> - шапка страницы/секции
<nav> - навигационное меню
<main> - основное содержимое
<section> - логический раздел
<article> - независимый блок контента
<aside> - боковая панель
<footer> - подвал страницы/секции
<div> - блочный контейнер`}
        </pre>

        <h3>Текстовые элементы</h3>
        <pre>
          {`<h1> - <h6> - заголовки (от самого важного до наименее важного)
<p> - параграф текста
<span> - строчный контейнер
<strong> - выделение важного текста
<em> - выделение акцентированного текста
<blockquote> - цитата
<code> - фрагмент кода
<pre> - предварительно отформатированный текст`}
        </pre>

        <h3>Списки</h3>
        <pre>
          {`<ul> - маркированный список
<ol> - нумерованный список
<li> - элемент списка
<dl> - список определений
<dt> - термин в списке определений
<dd> - описание термина`}
        </pre>

        <h3>Ссылки и медиа</h3>
        <pre>
          {`<a> - гиперссылка
<img> - изображение
<video> - видео
<audio> - аудио
<iframe> - встроенный фрейм`}
        </pre>

        <h3>Формы</h3>
        <pre>
          {`<form> - форма
<input> - поле ввода
<textarea> - многострочное поле ввода
<button> - кнопка
<select> - выпадающий список
<option> - элемент выпадающего списка
<label> - метка для элемента формы`}
        </pre>

        <h3>Таблицы</h3>
        <pre>
          {`<table> - таблица
<tr> - строка таблицы
<th> - заголовок столбца
<td> - ячейка таблицы
<thead> - группа строк заголовка
<tbody> - группа строк содержимого
<tfoot> - группа строк подвала`}
        </pre>

        <h3>Типовая структура HTML-документа</h3>
        <pre>
          {`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Название страницы</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>
      <!-- Навигация -->
    </nav>
  </header>
  
  <main>
    <section>
      <h1>Заголовок страницы</h1>
      <!-- Основной контент -->
    </section>
    
    <section>
      <!-- Дополнительный контент -->
    </section>
    
    <aside>
      <!-- Боковая панель -->
    </aside>
  </main>
  
  <footer>
    <!-- Подвал -->
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`}
        </pre>
      </>
    ),
  },
  {
    id: 2,
    name: "React Hooks Collection",
    description: "Набор полезных пользовательских хуков для React приложений",
    category: "React",
    downloads: 987,
    tags: ["react", "hooks", "javascript"],
    content: (
      <>
        <h2>React Hooks Collection</h2>
        <p>Полезные пользовательские хуки для ваших React-приложений:</p>
        <h3>useLocalStorage</h3>
        <pre>
          {`const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};`}
        </pre>
      </>
    ),
  },
  {
    id: 3,
    name: "CSS Grid Templates",
    description: "Готовые шаблоны CSS Grid для создания адаптивных сеток",
    category: "CSS",
    downloads: 856,
    tags: ["css", "grid", "responsive"],
    content: (
      <>
        <h2>CSS Grid Templates</h2>
        <p>Готовые шаблоны для создания адаптивных сеток:</p>
        <h3>Базовая сетка</h3>
        <pre>
          {`.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
}

.grid-item {
  padding: 20px;
  border: 1px solid #ddd;
}`}
        </pre>
        <h3>Макет страницы</h3>
        <pre>
          {`.page-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav content sidebar"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}`}
        </pre>
      </>
    ),
  },
  {
    id: 4,
    name: "Rust Basics",
    description: "Основы языка программирования Rust для начинающих",
    category: "Rust",
    downloads: 723,
    tags: ["rust", "programming", "basics"],
    content: (
      <>
        <h2>Основы Rust</h2>
        <p>Краткое введение в язык программирования Rust:</p>

        <h3>Переменные и типы данных</h3>
        <pre>
          {`// Неизменяемая переменная (по умолчанию)
let x = 5;

// Изменяемая переменная
let mut y = 10;
y = 15; // OK

// Явное указание типа
let z: i32 = 20;

// Основные типы данных
let a: i32 = 42;       // 32-битное целое число со знаком
let b: u64 = 100;      // 64-битное целое число без знака
let c: f64 = 3.14;     // 64-битное число с плавающей точкой
let d: bool = true;    // Логический тип
let e: char = 'a';     // Символ Unicode
let f: &str = "hello"; // Строковый срез
let g: String = String::from("world"); // Владеющая строка`}
        </pre>

        <h3>Функции</h3>
        <pre>
          {`// Определение функции
fn add(a: i32, b: i32) -> i32 {
    a + b // Неявный возврат (без точки с запятой)
}

// Функция без возвращаемого значения
fn say_hello(name: &str) {
    println!("Hello, {}!", name);
}

// Использование функций
fn main() {
    let sum = add(5, 10);
    say_hello("Rust");
}`}
        </pre>

        <h3>Управляющие конструкции</h3>
        <pre>
          {`// Условный оператор
if x > 10 {
    println!("x больше 10");
} else if x > 5 {
    println!("x больше 5, но не больше 10");
} else {
    println!("x не больше 5");
}

// Цикл while
let mut i = 0;
while i < 5 {
    println!("i = {}", i);
    i += 1;
}

// Цикл for
for j in 0..5 {
    println!("j = {}", j);
}

// Цикл for с итерацией по коллекции
let numbers = vec![1, 2, 3, 4, 5];
for num in &numbers {
    println!("num = {}", num);
}`}
        </pre>

        <h3>Структуры и перечисления</h3>
        <pre>
          {`// Определение структуры
struct Person {
    name: String,
    age: u32,
}

// Реализация методов для структуры
impl Person {
    // Конструктор
    fn new(name: &str, age: u32) -> Person {
        Person {
            name: String::from(name),
            age,
        }
    }

    // Метод
    fn say_hello(&self) {
        println!("Hello, my name is {} and I'm {} years old", self.name, self.age);
    }
}

// Определение перечисления
enum Color {
    Red,
    Green,
    Blue,
    RGB(u8, u8, u8),
}

// Использование структур и перечислений
fn main() {
    let person = Person::new("Alice", 30);
    person.say_hello();

    let color = Color::RGB(255, 0, 0);
    match color {
        Color::Red => println!("Red"),
        Color::Green => println!("Green"),
        Color::Blue => println!("Blue"),
        Color::RGB(r, g, b) => println!("RGB({}, {}, {})", r, g, b),
    }
}`}
        </pre>
      </>
    ),
  },
  {
    id: 5,
    name: "Solidity Smart Contracts",
    description:
      "Основы разработки смарт-контрактов на языке Solidity для блокчейна Ethereum",
    category: "Solidity",
    downloads: 892,
    tags: ["solidity", "blockchain", "ethereum", "smart-contracts"],
    content: (
      <>
        <h2>Основы Solidity</h2>
        <p>Введение в разработку смарт-контрактов на языке Solidity:</p>

        <h3>Структура смарт-контракта</h3>
        <pre>
          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // Переменные состояния
    uint256 private storedData;
    address public owner;

    // События
    event DataStored(address indexed from, uint256 value);

    // Модификаторы
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Конструктор
    constructor() {
        owner = msg.sender;
    }

    // Функции
    function set(uint256 x) public {
        storedData = x;
        emit DataStored(msg.sender, x);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}`}
        </pre>

        <h3>Типы данных</h3>
        <pre>
          {`// Целочисленные типы
uint8 a = 255;    // 8-битное целое без знака (0-255)
int16 b = -32768; // 16-битное целое со знаком (-32768 до 32767)
uint256 c = 123;  // 256-битное целое без знака (стандартный размер)

// Адреса
address d = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
address payable e = payable(d); // Адрес, который может получать Ether

// Логический тип
bool f = true;

// Строки и байты
string g = "Hello, Solidity";
bytes h = "Hello, Solidity";
bytes32 i = keccak256(abi.encodePacked("Hello"));

// Массивы
uint[] j = [1, 2, 3]; // Динамический массив
uint[3] k = [1, 2, 3]; // Статический массив

// Отображения (словари)
mapping(address => uint) balances;`}
        </pre>

        <h3>Функции и модификаторы</h3>
        <pre>
          {`// Типы функций
function readOnly() public view returns (uint) {
    // Не изменяет состояние
    return 42;
}

function pureFunction(uint a, uint b) public pure returns (uint) {
    // Не читает и не изменяет состояние
    return a + b;
}

function stateChanging(uint newValue) public {
    // Изменяет состояние
    storedData = newValue;
}

function payableFunction() public payable {
    // Может получать Ether
    // msg.value содержит количество отправленного Ether
}

// Модификаторы
modifier costs(uint price) {
    require(msg.value >= price, "Not enough Ether provided");
    _;
    // Возврат лишних средств
    if (msg.value > price) {
        payable(msg.sender).transfer(msg.value - price);
    }
}`}
        </pre>

        <h3>Пример токена ERC-20</h3>
        <pre>
          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10**uint256(_decimals);
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}`}
        </pre>
      </>
    ),
  },
  {
    id: 6,
    name: "Python Data Science Essentials",
    description: "Основные инструменты и библиотеки Python для анализа данных",
    category: "Python",
    downloads: 1056,
    tags: ["python", "data-science", "numpy", "pandas", "matplotlib"],
    content: (
      <>
        <h2>Python для анализа данных</h2>
        <p>Основные библиотеки и инструменты для работы с данными в Python:</p>

        <h3>NumPy - работа с массивами</h3>
        <pre>
          {`import numpy as np

# Создание массивов
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.zeros((3, 3))
arr3 = np.ones((2, 4))
arr4 = np.random.random((2, 2))

# Операции с массивами
print(arr1 * 2)          # [2 4 6 8 10]
print(arr1 + arr1)       # [2 4 6 8 10]
print(np.sqrt(arr1))     # [1. 1.41421356 1.73205081 2. 2.23606798]

# Индексирование и срезы
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(matrix[0, 0])      # 1
print(matrix[:, 1])      # [2 5 8] - второй столбец
print(matrix[1, :])      # [4 5 6] - вторая строка
print(matrix[0:2, 0:2])  # [[1 2], [4 5]] - подматрица 2x2

# Статистические функции
print(np.mean(arr1))     # 3.0
print(np.median(arr1))   # 3.0
print(np.std(arr1))      # 1.4142135623730951`}
        </pre>

        <h3>Pandas - анализ данных</h3>
        <pre>
          {`import pandas as pd
import numpy as np

# Создание DataFrame
df = pd.DataFrame({
    'A': [1, 2, 3, 4, 5],
    'B': [10, 20, 30, 40, 50],
    'C': ['a', 'b', 'c', 'd', 'e']
})

# Основные операции
print(df.head())         # Первые 5 строк
print(df.describe())     # Статистика по числовым столбцам
print(df['A'].mean())    # Среднее значение столбца A

# Фильтрация данных
filtered = df[df['A'] > 2]
print(filtered)

# Группировка и агрегация
grouped = df.groupby('C').sum()
print(grouped)

# Чтение и запись данных
# df.to_csv('data.csv', index=False)
# df_from_csv = pd.read_csv('data.csv')

# Обработка пропущенных значений
df_with_na = pd.DataFrame({
    'A': [1, 2, np.nan, 4, 5],
    'B': [10, np.nan, 30, 40, 50],
    'C': ['a', 'b', 'c', 'd', 'e']
})
print(df_with_na.isna().sum())  # Количество пропущенных значений
print(df_with_na.fillna(0))     # Заполнение пропусков нулями
print(df_with_na.dropna())      # Удаление строк с пропусками`}
        </pre>

        <h3>Matplotlib - визуализация данных</h3>
        <pre>
          {`import matplotlib.pyplot as plt
import numpy as np

# Линейный график
x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', label='sin(x)')
plt.title('Синусоида')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True)
plt.legend()
# plt.savefig('sin.png')
# plt.show()

# Гистограмма
data = np.random.randn(1000)
plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, alpha=0.7, color='skyblue')
plt.title('Гистограмма нормального распределения')
plt.xlabel('Значение')
plt.ylabel('Частота')
plt.grid(True)
# plt.show()

# Диаграмма рассеяния
x = np.random.randn(100)
y = 2 * x + np.random.randn(100) * 0.5
plt.figure(figsize=(10, 6))
plt.scatter(x, y, alpha=0.7)
plt.title('Диаграмма рассеяния')
plt.xlabel('x')
plt.ylabel('y')
plt.grid(True)
# plt.show()

# Несколько графиков на одном рисунке
fig, axs = plt.subplots(2, 2, figsize=(12, 10))

# График 1: линейный
axs[0, 0].plot(x, y, 'o-')
axs[0, 0].set_title('Линейный график')
axs[0, 0].grid(True)

# График 2: гистограмма
axs[0, 1].hist(data, bins=20)
axs[0, 1].set_title('Гистограмма')

# График 3: диаграмма рассеяния
axs[1, 0].scatter(x, y)
axs[1, 0].set_title('Диаграмма рассеяния')
axs[1, 0].grid(True)

# График 4: столбчатая диаграмма
categories = ['A', 'B', 'C', 'D', 'E']
values = [3, 7, 2, 5, 9]
axs[1, 1].bar(categories, values)
axs[1, 1].set_title('Столбчатая диаграмма')

plt.tight_layout()
# plt.show()`}
        </pre>

        <h3>Scikit-learn - машинное обучение</h3>
        <pre>
          {`from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Генерация данных
X = np.random.rand(100, 1) * 10
y = 2 * X + 1 + np.random.randn(100, 1)

# Разделение на обучающую и тестовую выборки
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Создание и обучение модели
model = LinearRegression()
model.fit(X_train, y_train)

# Предсказание
y_pred = model.predict(X_test)

# Оценка качества модели
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Коэффициенты: {model.coef_}')
print(f'Свободный член: {model.intercept_}')
print(f'Среднеквадратичная ошибка: {mse}')
print(f'Коэффициент детерминации (R²): {r2}')`}
        </pre>
      </>
    ),
  },
  // Остальные модули...
];

// Создаем контекст
export const ModulesContext = createContext();

// Хук для использования контекста
export const useModules = () => useContext(ModulesContext);

// Провайдер контекста
export const ModulesProvider = ({ children }) => {
  // Получаем данные из контекста авторизации
  const auth = useAuth() || {};
  const { user, isAuthenticated, updateUser } = auth;

  // Состояние для хранения установленных модулей
  const [installedModules, setInstalledModules] = useState([]);

  // Состояние для отображения индикатора загрузки
  const [isInstalling, setIsInstalling] = useState(false);

  // Состояние для хранения доступных модулей с сервера
  const [availableModules, setAvailableModules] = useState(exampleModules);
  const [isLoadingModules, setIsLoadingModules] = useState(false);

  // Состояние для отображения ошибок
  const [error, setError] = useState({ show: false, title: "", message: "" });

  // Функция для закрытия диалога с ошибкой
  const handleCloseError = () => {
    setError({ show: false, title: "", message: "" });
  };

  // Функция для сохранения установленных модулей в localStorage
  const saveInstalledModulesToLocalStorage = (modules) => {
    try {
      localStorage.setItem("installedModules", JSON.stringify(modules));
    } catch (error) {
      console.error("Ошибка при сохранении модулей в localStorage:", error);
    }
  };

  // Функция для загрузки установленных модулей из localStorage
  const loadInstalledModulesFromLocalStorage = () => {
    try {
      const savedModules = localStorage.getItem("installedModules");
      return savedModules ? JSON.parse(savedModules) : [];
    } catch (error) {
      console.error("Ошибка при загрузке модулей из localStorage:", error);
      return [];
    }
  };

  // Загружаем доступные модули с сервера
  useEffect(() => {
    const fetchModules = async () => {
      setIsLoadingModules(true);
      try {
        const response = await axios.get(`${API_URL}/modules`);
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setAvailableModules(response.data);
        } else {
          // Если с сервера пришел пустой массив, используем примеры
          console.log(
            "Сервер вернул пустой массив модулей, используем примеры"
          );
          setAvailableModules(exampleModules);
        }
      } catch (error) {
        console.error("Ошибка при загрузке модулей:", error);
        // Если не удалось загрузить модули с сервера, используем примеры
        console.log(
          "Ошибка при загрузке модулей с сервера, используем примеры"
        );
        setAvailableModules(exampleModules);
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  // Загружаем установленные модули из данных пользователя или localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      // Если пользователь авторизован, используем данные с сервера
      setTimeout(() => {
        const serverModules = user.installedModules || [];
        setInstalledModules(serverModules);
        // Сохраняем в localStorage для оффлайн-доступа
        saveInstalledModulesToLocalStorage(serverModules);
      }, 0);
    } else {
      // Если пользователь не авторизован, используем данные из localStorage
      const localModules = loadInstalledModulesFromLocalStorage();
      setInstalledModules(localModules);
    }
  }, [isAuthenticated, user]);

  // Сохраняем установленные модули в localStorage при их изменении
  useEffect(() => {
    saveInstalledModulesToLocalStorage(installedModules);
  }, [installedModules]);

  // Функция для установки модуля
  const installModule = async (moduleId) => {
    // Проверяем, авторизован ли пользователь
    if (!isAuthenticated) {
      setError({
        show: true,
        title: "Требуется авторизация",
        message: "Для установки модуля необходимо авторизоваться",
      });
      return false;
    }

    // Проверяем, не установлен ли уже модуль
    if (installedModules.includes(moduleId)) {
      return true;
    }

    // Показываем индикатор загрузки
    setIsInstalling(true);

    try {
      // Проверяем, является ли модуль демо-модулем (id от 1 до 21)
      const isDemoModule = moduleId >= 1 && moduleId <= 21;

      // Оптимистичное обновление UI
      const updatedModules = [...installedModules, moduleId];
      setInstalledModules(updatedModules);

      if (isDemoModule) {
        // Для демо-модулей имитируем успешный ответ сервера
        console.log("Установка демо-модуля:", moduleId);

        // Создаем имитацию ответа сервера
        const mockResponse = {
          message: "Модуль успешно установлен",
          user: {
            ...user,
            installedModules: updatedModules,
          },
          installedModules: updatedModules,
        };

        // Обновляем данные пользователя
        if (updateUser) {
          // Используем setTimeout для обеспечения правильного порядка обновления состояния
          setTimeout(() => {
            updateUser(mockResponse.user);
          }, 0);
        }

        // Скрываем индикатор загрузки
        setIsInstalling(false);

        return true;
      } else {
        // Для реальных модулей отправляем запрос на сервер
        const response = await axios.post(
          `${API_URL}/modules/${moduleId}/install`
        );

        console.log("Ответ сервера при установке модуля:", response.data);

        // Обновляем данные пользователя
        if (updateUser && response.data.user) {
          // Используем setTimeout для обеспечения правильного порядка обновления состояния
          setTimeout(() => {
            updateUser(response.data.user);
          }, 0);
        }

        // Обновляем список установленных модулей с данными с сервера
        if (response.data.installedModules) {
          // Используем setTimeout для обеспечения правильного порядка обновления состояния
          setTimeout(() => {
            setInstalledModules(response.data.installedModules);
          }, 0);
        }

        // Скрываем индикатор загрузки
        setIsInstalling(false);

        return true;
      }
    } catch (error) {
      console.error("Ошибка при установке модуля:", error);

      // Откатываем оптимистичное обновление в случае ошибки
      const originalModules = installedModules.filter((id) => id !== moduleId);
      setInstalledModules(originalModules);

      setIsInstalling(false);

      // Показываем более информативное сообщение об ошибке
      let errorTitle = "Ошибка установки";
      let errorMessage = "Ошибка при установке модуля. Попробуйте позже.";

      if (error.response) {
        // Ошибка от сервера с ответом
        if (error.response.status === 404) {
          errorMessage =
            "Модуль не найден на сервере. Возможно, вы используете демо-версию модуля.";
        } else if (error.response.status === 401) {
          errorTitle = "Требуется авторизация";
          errorMessage = "Необходима авторизация для установки модуля.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `${error.response.data.message}`;
        }
      } else if (error.request) {
        // Запрос был сделан, но ответ не получен
        errorMessage = "Сервер не отвечает. Проверьте подключение к интернету.";
      }

      setError({
        show: true,
        title: errorTitle,
        message: errorMessage,
      });
      return false;
    }
  };

  // Функция для удаления модуля
  const uninstallModule = async (moduleId) => {
    // Проверяем, авторизован ли пользователь
    if (!isAuthenticated) {
      setError({
        show: true,
        title: "Требуется авторизация",
        message: "Для удаления модуля необходимо авторизоваться",
      });
      return false;
    }

    // Проверяем, установлен ли модуль
    if (!installedModules.includes(moduleId)) {
      return true;
    }

    // Показываем индикатор загрузки
    setIsInstalling(true);

    try {
      // Проверяем, является ли модуль демо-модулем (id от 1 до 21)
      const isDemoModule = moduleId >= 1 && moduleId <= 21;

      // Оптимистичное обновление UI
      const updatedModules = installedModules.filter((id) => id !== moduleId);
      setInstalledModules(updatedModules);

      if (isDemoModule) {
        // Для демо-модулей имитируем успешный ответ сервера
        console.log("Удаление демо-модуля:", moduleId);

        // Создаем имитацию ответа сервера
        const mockResponse = {
          message: "Модуль успешно удален",
          user: {
            ...user,
            installedModules: updatedModules,
          },
          installedModules: updatedModules,
        };

        // Обновляем данные пользователя
        if (updateUser) {
          // Используем setTimeout для обеспечения правильного порядка обновления состояния
          setTimeout(() => {
            updateUser(mockResponse.user);
          }, 0);
        }

        // Скрываем индикатор загрузки
        setIsInstalling(false);

        return true;
      } else {
        // Для реальных модулей отправляем запрос на сервер
        const response = await axios.delete(
          `${API_URL}/modules/${moduleId}/uninstall`
        );

        console.log("Ответ сервера при удалении модуля:", response.data);

        // Обновляем данные пользователя
        if (updateUser && response.data.user) {
          // Используем setTimeout для обеспечения правильного порядка обновления состояния
          setTimeout(() => {
            updateUser(response.data.user);
          }, 0);
        }

        // Обновляем список установленных модулей с данными с сервера
        if (response.data.installedModules) {
          // Используем setTimeout для обеспечения правильного порядка обновления состояния
          setTimeout(() => {
            setInstalledModules(response.data.installedModules);
          }, 0);
        }

        // Скрываем индикатор загрузки
        setIsInstalling(false);

        return true;
      }
    } catch (error) {
      console.error("Ошибка при удалении модуля:", error);

      // Откатываем оптимистичное обновление в случае ошибки
      const originalModules = [...installedModules, moduleId];
      setInstalledModules(originalModules);

      setIsInstalling(false);

      // Показываем более информативное сообщение об ошибке
      let errorTitle = "Ошибка удаления";
      let errorMessage = "Ошибка при удалении модуля. Попробуйте позже.";

      if (error.response) {
        // Ошибка от сервера с ответом
        if (error.response.status === 404) {
          errorMessage =
            "Модуль не найден на сервере. Возможно, вы используете демо-версию модуля.";
        } else if (error.response.status === 401) {
          errorTitle = "Требуется авторизация";
          errorMessage = "Необходима авторизация для удаления модуля.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `${error.response.data.message}`;
        }
      } else if (error.request) {
        // Запрос был сделан, но ответ не получен
        errorMessage = "Сервер не отвечает. Проверьте подключение к интернету.";
      }

      setError({
        show: true,
        title: errorTitle,
        message: errorMessage,
      });
      return false;
    }
  };

  // Функция для проверки, установлен ли модуль
  const isModuleInstalled = (moduleId) => {
    return installedModules.includes(moduleId);
  };

  // Функция для получения установленного модуля по ID
  const getInstalledModule = (moduleId) => {
    return availableModules.find((module) => module.id === moduleId);
  };

  // Функция для получения всех установленных модулей
  const getAllInstalledModules = () => {
    return availableModules.filter((module) =>
      installedModules.includes(module.id)
    );
  };

  // Значение контекста
  const contextValue = {
    installedModules,
    isInstalling,
    isLoadingModules,
    installModule,
    uninstallModule,
    isModuleInstalled,
    getInstalledModule,
    getAllInstalledModules,
    availableModules,
  };

  return (
    <ModulesContext.Provider value={contextValue}>
      {children}
      <ErrorDialog
        open={error.show}
        onClose={handleCloseError}
        title={error.title}
        message={error.message}
      />
    </ModulesContext.Provider>
  );
};
