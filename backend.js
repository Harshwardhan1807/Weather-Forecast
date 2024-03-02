const cityInput=document.querySelector(".input");
const searchButton=document.querySelector(".btn");
const currentWeatherDiv=document.querySelector(".current-weather");
const weatherCardsDiv=document.querySelector(".days-forecast");


const API_KEY = "1488829331411df389212b984a7402e8";

const getCityCoordinates=()=>{
    const city=cityInput.value.trim();
    if(city==="") return;
    const API_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${city}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

       
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const createWeatherCard=(cityName,weatherItem,index) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="current-weather">
                    <h1>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h1>
                    <h3>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h3>
                    <h3>Wind: ${weatherItem.wind.speed} M/S</h3>
                    <h3>Humidity: ${weatherItem.main.humidity}%</h3>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h3><span class="des"> ${weatherItem.weather[0].description}</span></h3>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
}

searchButton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup",e=> e.key==="Enter" && getCityCoordinates());