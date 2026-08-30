/*
WeatherAPI.com
Weather and Geolocation API - Weather and Geolocation API JSON and XML
https://www.weatherapi.com/docs/
https://www.weatherapi.com/login.aspx
*/

const searchInput = document.querySelector(".search-input");
const locationButton = document.querySelector(".location-button");
const currentWeatherDiv = document.querySelector(".current-weather");
const hourlyWeatherDiv = document.querySelector(".hourly-weather .weather-list");

const API_KEY = "686319e6555643978de162633251611";

// Weather codes for mapping to custom icons
// Códigos meteorológicos para mapeamento para ícones personalizados
const weatherCodes = {
  clear: [1000],
  clouds: [1003, 1006, 1009],
  mist: [1030, 1135, 1147],
  rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
  moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
  snow: [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
  thunder: [1087, 1279, 1282],
  thunder_rain: [1273, 1276]
}

const displayHourlyForecast = (hourlyData) => {
  const currentHour = new Date().setMinutes(0, 0, 0);
  const next24Hours = currentHour + 24 * 60 * 60 * 1000;

  // Filter the hourly data to only include the next 24 hours
  // Filtra os dados horários para incluir apenas as próximas 24 horas
  const next24HoursData = hourlyData.filter(({ time }) => {
    const forecastTime = new Date(time).getTime();
    return forecastTime >= currentHour && forecastTime <= next24Hours;
  });

  // Generate HTML for each hourly forecast and display it
  // Gerar HTML para cada previsão horária e exibi-lo
  hourlyWeatherDiv.innerHTML = next24HoursData.map(item => {
    const time = item.time.split(" ")[1].substring(0, 5);
    const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(item.condition.code));
    const tempCelsius = item.temp_c;
    const tempFahrenheit = item.temp_f;
    const pressureMb = item.pressure_mb;
    const windSpeed = item.wind_kph;
    const windDirection = item.wind_dir;
    const humidity = item.humidity;
    const description = item.condition.text;

    return `<li class="weather-item">
            <p class="time" title="próxima hora">${time}</p>
            <img src="weather-app-icons/${weatherIcon}.svg" class="weather-icon" title="previsão horária">
            <p class="temp-celsius" data-title="Celsius">${tempCelsius} <span>ºC</span></p>
            <p class="temp-fahrenheit" data-title="Fahrenheit">${tempFahrenheit} <span>ºF</span></p>
            <p class="pressure-mb" data-title="pressão atmosférica">${pressureMb} <span>mb</span></p></p>
            <p class="wind-speed" data-title="velocidade do vento">${windSpeed} <span>k/h</span></p>
            <p class="wind-direction" data-title="direção do vento">${windDirection}</p>
            <p class="humidity" data-title="umidade do ar">${humidity}<span>%</span></p>
            <p class="description" data-title="condição do tempo">${description}</p>
          </li>`;
  }).join("");
}

const getWeatherDetails = async (API_URL) => {
  window.innerWidth <= 768 && searchInput.blur();
  document.body.classList.remove("show-no-results");

  try {
    // Fetch weather data from the API and parse the response to JSON
    // Busque dados meteorológicos da API e analise a resposta em JSON
    const response = await fetch(API_URL);
    const data = await response.json();

    // Extract current weather details
    // Extrai detalhes meteorológicos atuais
    // ** location **
    const city = data.location.name;
    const state = data.location.region;
    const country = data.location.country;
    const lat = data.location.lat;
    const lon = data.location.lon;
    const timezone = data.location.tz_id;
    const localtime = data.location.localtime;
    // ** current **
    const lastUpdate = data.current.last_updated;
    const tempCelsius = data.current.temp_c;
    const tempFahrenheit = data.current.temp_f;
    // ** current / condition **
    const description = data.current.condition.text;
    const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code));
    // ** current **
    const windSpeed = data.current.wind_kph;
    const windDegree = data.current.wind_degree;
    const windDirection = data.current.wind_dir;
    const pressureMb = data.current.pressure_mb;
    const precipMm = data.current.precip_mm;
    const humidity = data.current.humidity;
    const cloud = data.current.cloud;
    const feelsLike = data.current.feelslike_c;
    const heatindex = data.current.heatindex_c;
    const uv = data.current.uv;
    const maxTemp = data.forecast.forecastday[0].day.maxtemp_c;
    const minTemp = data.forecast.forecastday[0].day.mintemp_c;
    const averageTemp = data.forecast.forecastday[0].day.avgtemp_c;
    const maxWind = data.forecast.forecastday[0].day.maxwind_kph;
    const totalPrecipitation = data.forecast.forecastday[0].day.totalprecip_mm;
    const avgHumidity = data.forecast.forecastday[0].day.avghumidity;
    const dailyWillItRain = data.forecast.forecastday[0].day.daily_will_it_rain;
    const dailyChanceRain = data.forecast.forecastday[0].day.daily_chance_of_rain;
    const conditionText = data.forecast.forecastday[0].day.condition.text;
    const dayUV = data.forecast.forecastday[0].day.uv;
    const sunrise = data.forecast.forecastday[0].astro.sunrise.split(" ")[0].substring(1, 5);
    const sunset = data.forecast.forecastday[0].astro.sunset.split(" ")[0].substring(1, 5);
    const moonrise = data.forecast.forecastday[0].astro.moonrise.split(" ")[0].substring(1, 5);
    const moonset = data.forecast.forecastday[0].astro.moonset.split(" ")[0].substring(1, 5);
    const moonPhase = data.forecast.forecastday[0].astro.moon_phase;

    // Update the current weather display
    // Atualiza a exibição da previsão do tempo atual
    currentWeatherDiv.querySelector(".country").innerHTML = `${country}`; // #1
    currentWeatherDiv.querySelector(".state").innerHTML = `${state}`; // #2
    currentWeatherDiv.querySelector(".city").innerHTML = `${city}`; // #3
    currentWeatherDiv.querySelector(".latitude").innerHTML = `${lat}`; // #4
    currentWeatherDiv.querySelector(".longitude").innerHTML = `${lon}`; // #5
    currentWeatherDiv.querySelector(".timezone").innerHTML = `${timezone}`; // #6
    currentWeatherDiv.querySelector(".local-time").innerHTML = `${localtime}`; // #7
    currentWeatherDiv.querySelector(".last-update").innerHTML = `${lastUpdate}`; // #8
    currentWeatherDiv.querySelector(".weather-icon").src = `weather-app-icons/${weatherIcon}.svg`; // #9
    currentWeatherDiv.querySelector(".temp-celsius").innerHTML = `${tempCelsius}<span></span>`; // #10
    currentWeatherDiv.querySelector(".temp-fahrenheit").innerHTML = `${tempFahrenheit}<span></span>`; // #11
    currentWeatherDiv.querySelector(".min-temp").innerHTML = `${minTemp}<span></span>`; // #12
    currentWeatherDiv.querySelector(".max-temp").innerHTML = `${maxTemp}<span></span>`; // #13
    currentWeatherDiv.querySelector(".average-temp").innerHTML = `${averageTemp}<span></span>`; // #14
    currentWeatherDiv.querySelector(".feels-like").innerHTML = `${feelsLike}<span></span>`; // #15
    currentWeatherDiv.querySelector(".heat-index").innerHTML = `${heatindex}`; // #16
    currentWeatherDiv.querySelector(".uv").innerHTML = `${uv}`; // #17
    currentWeatherDiv.querySelector(".day-uv").innerHTML = `${dayUV}`; // #17
    currentWeatherDiv.querySelector(".daily-will-rain").innerHTML = `${dailyWillItRain}<span></span>`; // #18
    currentWeatherDiv.querySelector(".daily-chance-rain").innerHTML = `${dailyChanceRain}<span></span>`; // #18
    currentWeatherDiv.querySelector(".avg-humidity").innerHTML = `${avgHumidity}<span></span>`; // #19
    currentWeatherDiv.querySelector(".total-precip").innerHTML = `${totalPrecipitation}<span></span>`; // #20
    currentWeatherDiv.querySelector(".humidity").innerHTML = `${humidity}<span></span>`; // #21
    currentWeatherDiv.querySelector(".pressure-mb").innerHTML = `${pressureMb}`; // #22
    currentWeatherDiv.querySelector(".precip-mm").innerHTML = `${precipMm}`; // #23
    currentWeatherDiv.querySelector(".cloud").innerHTML = `${cloud}<span></span>`; // #24
    currentWeatherDiv.querySelector(".wind-direction").innerHTML = `${windDirection}`; // #25
    currentWeatherDiv.querySelector(".wind-degree").innerHTML = `${windDegree}`; // #25
    currentWeatherDiv.querySelector(".wind-speed").innerHTML = `${windSpeed}<span></span>`; // #26
    currentWeatherDiv.querySelector(".max-wind-speed").innerHTML = `${maxWind}<span></span>`; // #27
    currentWeatherDiv.querySelector(".sunrise").innerHTML = `${sunrise}<span></span>`; // #28
    currentWeatherDiv.querySelector(".sunset").innerHTML = `${sunset}<span></span>`; // #29
    currentWeatherDiv.querySelector(".moonrise").innerHTML = `${moonrise}<span></span>`; // #30
    currentWeatherDiv.querySelector(".moonset").innerHTML = `${moonset}<span></span>`; // #31
    currentWeatherDiv.querySelector(".moon-phase").innerHTML = `${moonPhase}<span></span>`; // #32
    currentWeatherDiv.querySelector(".description").innerText = description; // #33
    currentWeatherDiv.querySelector(".condition-text").innerHTML = `${conditionText}<span></span>`; // #34

    // Combine hourly data from today and tomorrow
    // Combina os dados horários de hoje e de amanhã
    const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
    displayHourlyForecast(combinedHourlyData);

    searchInput.value = data.location.name;
  } catch (error) {
    document.body.classList.add("show-no-results");
  }
}

// Set up the weather request for a specific city
// Configura a solicitação de previsão do tempo para uma cidade específica
const setupWeatherRequest = (cityName) => {
  const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&lang=pt&days=5`;
  getWeatherDetails(API_URL);
}

// Handle user input in the search box
// Lida com as entradas do usuário na caixa de pesquisa
searchInput.addEventListener("keyup", (e) => {
  const cityName = searchInput.value.trim();
  if (e.key == "Enter" && cityName) {
    setupWeatherRequest(cityName);
  }
});

// Get user's coordinates and fetch weather data for current location
// Obtem as coordenadas do usuário e busca dados meteorológicos para a localização atual
locationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&lang=pt&days=5`;
    getWeatherDetails(API_URL);
  }, error => {
    alert("Acesso à localização negado. Ative as permissões para usar este recurso");
    // alert("Location access denied. Please enable permissions to use this feature");
  });
});

// Initial weather request default city
// Solicitação inicial de previsão do tempo - cidade padrão
setupWeatherRequest("londrina");
