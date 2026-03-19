const API_KEY = 'e8e1130ab14a978254f51e9074b3a876'; 

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContent = document.getElementById('weatherContent');
const historyContainer = document.getElementById('historyContainer');
const consoleLog = document.getElementById('consoleLog');

// 1. Initialize Local Storage Array
let searchHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
renderHistory();

// 2. Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        handleSearch(city);
    }
});

// 3. Main Search Function
function handleSearch(city) {
    consoleLog.innerHTML = '';
    
    logToConsole('Sync Start');
    logToConsole('Sync End');
    logToConsole('[ASYNC] start fetching');

    Promise.resolve().then(() => {
        logToConsole('Promise.then (Microtask)');
    });

    setTimeout(() => {
        logToConsole('setTimeout (Macrotask)');
    }, 0);

    fetchWeather(city);
}

// 4. Asynchronous API Fetching
async function fetchWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        logToConsole('[ASYNC] Data received');

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        
        displayWeather(data);
        addToHistory(data.name);

    } catch (error) {
        displayError(error.message);
    }
}

// 5. UI Updating Functions
function displayWeather(data) {
    weatherContent.innerHTML = `
        <div class="weather-row">
            <span>City</span>
            <strong>${data.name}, ${data.sys.country}</strong>
        </div>
        <div class="weather-row">
            <span>Temp</span>
            <strong>${data.main.temp} °C</strong>
        </div>
        <div class="weather-row">
            <span>Weather</span>
            <strong>${data.weather[0].main}</strong>
        </div>
        <div class="weather-row">
            <span>Humidity</span>
            <strong>${data.main.humidity}%</strong>
        </div>
        <div class="weather-row">
            <span>Wind</span>
            <strong>${data.wind.speed} m/s</strong>
        </div>
    `;
}

function displayError(message) {
    weatherContent.innerHTML = `<p class="error-msg">Error: ${message}</p>`;
}

// 6. Local Storage & History Handling
function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
        renderHistory();
    }
}

function renderHistory() {
    historyContainer.innerHTML = '';
    searchHistory.forEach(city => {
        const pill = document.createElement('div');
        pill.className = 'history-pill';
        pill.textContent = city;
        pill.addEventListener('click', () => {
            cityInput.value = city;
            handleSearch(city);
        });
        historyContainer.appendChild(pill);
    });
}

// 7. Custom Console Logger function
function logToConsole(message) {
    const li = document.createElement('li');
    li.textContent = message;
    consoleLog.appendChild(li);
    console.log(message);
}