// Global variables
var weatherContainer = document.getElementById("current-weather-container")
var searchContainer = document.getElementById("search-container")
var forecastContainer = document.getElementById("forecast-container")
var locationInput = document.getElementById("location-picker").value
var weatherHeader = document.getElementById("current-weather-header")
var forecastHeader = document.getElementById("forecast-header")
var apiKey = "126e4065d97fedad97742cdb5c363ca9"
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
const historyEl = document.getElementById("history");
const clearEl = document.getElementById("clear-history")

// Fetches current weather data from API
function fetchCurrentData(cityName) {
    weatherHeader.classList.remove("d-none")
    weatherContainer.innerHTML=""
    var weatherQueryString = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&Appid=" + apiKey + "&units=imperial"
    fetch(weatherQueryString)
    .then(res => res.json())
    .then(function (data){
        console.log(data)

        // Dynamic HTML variables
        var forecast = data.main
        var icon = data.weather[0].icon
        var weatherDate = document.createElement('p')
        var weatherCurrentTemp = document.createElement('p')
        var weatherHumidity = document.createElement('p')
        var weatherWind = document.createElement('p')
        var weatherIcon = document.createElement('img')
        var iconURL = "https://openweathermap.org/img/wn/"
        var cityName = document.createElement('h1')
        
        //Displays the name of the city
        cityName.textContent = data.name
        cityName.classList.add("city-name", "align-middle")
        
        // Displays the date in M/DD/YYYY format
        var utcSeconds = data.dt;
        var forecastDate = new Date(0)
        forecastDate.setUTCSeconds(utcSeconds);
        var month = forecastDate.getMonth()
        var day = forecastDate.getDate()
        var year = forecastDate.getFullYear()
        weatherDate.textContent = "(" + month + "/" + day + "/" + year + ")"
        
        // Displays temperature
        weatherCurrentTemp.textContent = "Temperature: " + forecast.temp
        
        // Displays humidity
        weatherHumidity.textContent = "Humidity: " + forecast.humidity + "%"
    
        // Displays wind speed
        weatherWind.textContent =  "Wind: " + data.wind.speed + " MPH"
    
        // Displays corresponding icon
        iconimport = iconURL.concat(icon)
        weatherIcon.setAttribute("src" , iconimport+".png")

        // Appends data to the container
        weatherContainer.append(cityName, weatherDate, weatherCurrentTemp, weatherHumidity, weatherWind)

        // Fetches UV index using data from the initial fetch request (latitude and longitude)
        var lat = data.coord.lat
        var lon = data.coord.lon
        var uvURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apiKey}`
        console.log(uvURL)
        fetch(uvURL)
        .then(res => res.json())
        .then(function (data){
            var uvIndex = document.createElement('p')
            uvIndex.textContent = "UV: " + data.current.uvi
            weatherContainer.append(uvIndex, weatherIcon)
        })

        
    })
};

// Fetches five-day weather forecast from API
function fetchForecastData(cityName) {
    forecastHeader.classList.remove("d-none")
    forecastContainer.innerHTML=""
    var weatherQueryString = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&Appid=" + apiKey + "&units=imperial"
    console.log(weatherQueryString)
    fetch(weatherQueryString)
    .then(res => res.json())
    .then(function (data){
        console.log(data.list)
        var forecast = data.list
        // Loops through and displays data
    for (var i = 3; i < forecast.length; i+=8) {

        var forecastCard = document.createElement('div')
        forecastCard.classList.add("col-md-2", "forecast", "bg-primary", "text-white", "m-2", "rounded")
        
        // Displays each date in M/DD/YYYY format
        var date = document.createElement('p')
        var forecastDate = new Date(forecast[i].dt_txt)
        var month = forecastDate.getMonth()
        var day = forecastDate.getDate()
        var year = forecastDate.getFullYear()
        date.textContent = month + "/" + day + "/" + year 
        forecastCard.append(date);

        // Displays temperature at specified hour
        var temp = document.createElement('p')
        temp.textContent = "Temperature: " + forecast[i].main.temp + "° F"
        forecastCard.append(temp);

        // Displays wind speed
        var wind = document.createElement('p')
        wind.textContent = "Wind: " + forecast[i].wind.speed + " MPH"
        forecastCard.append(wind)

        // Displays humidity
        var humidity = document.createElement('p')
        humidity.textContent = "Humidity: " + forecast[i].main.humidity + "%"
        forecastCard.append(humidity)

        // Displays weather icons
        var weatherIcon = document.createElement("img")
        var iconURL = "https://openweathermap.org/img/wn/"
        var icon = forecast[i].weather[0].icon
        var iconImport = iconURL.concat(icon)
        weatherIcon.setAttribute("src", iconImport + ".png" )
        forecastCard.append(weatherIcon)

        forecastContainer.append(forecastCard)

    }
    })
};

// Gets search history (if any)
function getSearchHistory(){
    const searchTerm = document.getElementById("location-picker").value
    fetchCurrentData(searchTerm);
    fetchForecastData(searchTerm)
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
}

// Clears search history
clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})

function k2f(K) {
     return Math.floor((K - 273.15) * 1.8 + 32);
 }

// Displays search history on page; initializes fetch API functions and passes user input as the parameter
function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            fetchCurrentData(historyItem.value);
            fetchForecastData(historyItem.value)
        })
        historyEl.append(historyItem);
    }
}

