var weatherContainer = document.getElementById("current-weather-container")
var searchContainer = document.getElementById("search-container")
var forecastContainer = document.getElementById("forecast-container")

var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var apiKey = "126e4065d97fedad97742cdb5c363ca9"

function fetchCurrentData() {
    var locationInput = document.getElementById("location-picker").value
    var weatherQueryString = weatherURL.concat(locationInput) + "&Appid=" + apiKey + "&units=imperial"

    fetch(weatherQueryString)
    .then(res => res.json())
    .then(function (data){
        var forecast = data.main
        var icon = data.weather[0].icon
        var weatherDate = document.createElement('p')
        var weatherCurrentTemp = document.createElement('p')
        var weatherHumidity = document.createElement('p')
        var weatherMaxTemp = document.createElement('p')
        var weatherMinTemp = document.createElement('p')
        var weatherIcon = document.createElement('img')
        var iconURL = "https://openweathermap.org/img/wn/"
        
       // weatherDate.textContent = moment().format("dddd, MMMM Do")
        //weatherDate.classList.add("weather-date")
    
        weatherCurrentTemp.textContent = "Current Temp: " + forecast.temp
        weatherCurrentTemp.classList.add("weather-current-temp");
        
        weatherHumidity.textContent = "Humidity: " + forecast.humidity
        weatherHumidity.classList.add("weather-humidity");
    
        weatherMaxTemp.textContent =  "High: " + forecast.temp_max + "° F"
        weatherMaxTemp.classList.add("weather-max-temp");
    
        weatherMinTemp.textContent = "Low: " + forecast.temp_min + "° F"
        weatherMinTemp.classList.add("weather-min-temp");
    
        
        iconimport = iconURL.concat(icon)
        weatherIcon.setAttribute("src" , iconimport+".png")
        weatherIcon.classList.add("weather-icon");
    
        weatherContainer.append(weatherDate, weatherCurrentTemp, weatherHumidity, weatherMaxTemp, weatherMinTemp)
        weatherContainer.append(weatherIcon);

        fetchForecastData();
    })
}

function fetchForecastData() {
    var locationInput = document.getElementById("location-picker").value
    var weatherQueryString = forecastURL.concat(locationInput) + "&Appid=" + apiKey + "&units=imperial"

    fetch(weatherQueryString)
    .then(res => res.json())
    .then(function (data){
        console.log(data.list)
        var forecast = data.list
    for (var i = 3; i < forecast.length; i+=8) {
        var date = document.createElement('p')
        date.textContent = forecast[i].dt_txt
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
    }
    })
}