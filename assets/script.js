var weatherContainer = document.getElementById("current-weather-container")
var searchContainer = document.getElementById("search-container")
var forecastContainer = document.getElementById("forecast-container")

var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var apiKey = "126e4065d97fedad97742cdb5c363ca9"
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
const historyEl = document.getElementById("history");
const clearEl = document.getElementById("clear-history")

var locationInput = document.getElementById("location-picker").value

//renderLastLocation();

function fetchCurrentData(cityName) {
    
    var weatherQueryString = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&Appid=" + apiKey + "&units=imperial"

    fetch(weatherQueryString)
    .then(res => res.json())
    .then(function (data){
        console.log(data)
        var forecast = data.main
        var icon = data.weather[0].icon
        var weatherDate = document.createElement('p')
        var weatherCurrentTemp = document.createElement('p')
        var weatherHumidity = document.createElement('p')
        var weatherWind = document.createElement('p')
        var weatherIcon = document.createElement('img')
        var iconURL = "https://openweathermap.org/img/wn/"
        var cityName = document.createElement('h1')
        

        cityName.textContent = data.name

        var utcSeconds = data.dt;
        var forecastDate = new Date(0)
        forecastDate.setUTCSeconds(utcSeconds);
        var month = forecastDate.getMonth()
        var day = forecastDate.getDate()
        var year = forecastDate.getFullYear()
        weatherDate.textContent = "(" + month + "/" + day + "/" + year + ")"
    
        weatherCurrentTemp.textContent = "Temperature: " + forecast.temp
        weatherCurrentTemp.classList.add("weather-current-temp");
        
        weatherHumidity.textContent = "Humidity: " + forecast.humidity + "%"
        weatherHumidity.classList.add("weather-humidity");
    
        weatherWind.textContent =  "Wind: " + data.wind.speed + " MPH"
        weatherWind.classList.add("weather-max-temp");
    
        
        iconimport = iconURL.concat(icon)
        weatherIcon.setAttribute("src" , iconimport+".png")
        weatherIcon.classList.add("weather-icon");

        weatherContainer.append(cityName, weatherDate, weatherCurrentTemp, weatherHumidity, weatherWind)

        
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

    //fetchForecastData();
}

function fetchForecastData(cityName) {
    // var locationInput = document.getElementById("location-picker").value
    var weatherQueryString = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&Appid=" + apiKey + "&units=imperial"
    console.log(weatherQueryString)
    fetch(weatherQueryString)
    .then(res => res.json())
    .then(function (data){
        console.log(data.list)
        var forecast = data.list
    for (var i = 3; i < forecast.length; i+=8) {
        var date = document.createElement('p')
        var forecastDate = new Date(forecast[i].dt_txt)
        var month = forecastDate.getMonth()
        var day = forecastDate.getDate()
        var year = forecastDate.getFullYear()
        date.textContent = month + "/" + day + "/" + year 
        forecastContainer.append(date);

        var temp = document.createElement('p')
        temp.textContent = "Temperature: " + forecast[i].main.temp + "° F"
        forecastContainer.append(temp);

        var wind = document.createElement('p')
        wind.textContent = "Wind: " + forecast[i].wind.speed + " MPH"
        forecastContainer.append(wind)

        var humidity = document.createElement('p')
        humidity.textContent = "Humidity: " + forecast[i].main.humidity + "%"
        forecastContainer.append(humidity)

        var weatherIcon = document.createElement("img")
        var iconURL = "https://openweathermap.org/img/wn/"
        var icon = forecast[i].weather[0].icon
        var iconImport = iconURL.concat(icon)
        weatherIcon.setAttribute("src", iconImport + ".png" )
        forecastContainer.append(weatherIcon)

        // var locationInput = document.getElementById("location-picker").value
        // localStorage.setItem("location", locationInput);
        // renderLastLocation();

    }
    })
};

function getSearchHistory(){
    const searchTerm = document.getElementById("location-picker").value
    fetchCurrentData(searchTerm);
    fetchForecastData(searchTerm)
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
}

clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})

function k2f(K) {
     return Math.floor((K - 273.15) * 1.8 + 32);
 }

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

// renderSearchHistory();
// if (searchHistory.length > 0) {
//     fetchCurrentData(searchHistory[searchHistory.length - 1]);
// }



// function renderLastLocation(){
//     var location = localStorage.getItem("location");
//     var lastLocationSpan = document.getElementById("last-location")
//     lastLocationSpan.textContent = " " + location

// };

