var weatherContainer = document.getElementById("current-weather-container")
var searchContainer = document.getElementById("search-container")
var forecastContainer = document.getElementById("forecast-container")

var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="
var apiKey = "126e4065d97fedad97742cdb5c363ca9"

function fetchWeatherData() {
    var locationInput = document.getElementById("location-picker").value
    var weatherQueryString = weatherURL.concat(locationInput) + "&Appid=" + apiKey + "&units=imperial"

    fetch(weatherQueryString)
}