const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const feedback = document.getElementById('feedback');
const locationButton = document.getElementById('location-button');
const forecastList = document.getElementById('forecast-list');

const elements = {
  locationName: document.getElementById('location-name'),
  currentDate: document.getElementById('current-date'),
  currentDescription: document.getElementById('current-description'),
  currentTemp: document.getElementById('current-temp'),
  feelsLike: document.getElementById('feels-like'),
  maxTemp: document.getElementById('max-temp'),
  minTemp: document.getElementById('min-temp'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('wind-speed'),
  precipitation: document.getElementById('precipitation'),
  rainProbability: document.getElementById('rain-probability'),
  weatherIcon: document.getElementById('weather-icon'),
};

const weatherCodeMap = {
  0: { label: 'Céu limpo', icon: '☀️' },
  1: { label: 'Predominantemente limpo', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Neblina', icon: '🌫️' },
  48: { label: 'Neblina com geada', icon: '🌫️' },
  51: { label: 'Garoa fraca', icon: '🌦️' },
  53: { label: 'Garoa moderada', icon: '🌦️' },
  55: { label: 'Garoa intensa', icon: '🌧️' },
  61: { label: 'Chuva fraca', icon: '🌧️' },
  63: { label: 'Chuva moderada', icon: '🌧️' },
  65: { label: 'Chuva forte', icon: '⛈️' },
  71: { label: 'Neve fraca', icon: '🌨️' },
  73: { label: 'Neve moderada', icon: '🌨️' },
  75: { label: 'Neve forte', icon: '❄️' },
  80: { label: 'Pancadas fracas', icon: '🌦️' },
  81: { label: 'Pancadas moderadas', icon: '🌧️' },
  82: { label: 'Pancadas fortes', icon: '⛈️' },
  95: { label: 'Tempestade', icon: '⛈️' },
  96: { label: 'Tempestade com granizo', icon: '⛈️' },
  99: { label: 'Tempestade severa', icon: '⛈️' },
};

function setFeedback(message, tone = 'secondary') {
  feedback.textContent = message;
  feedback.className = `feedback-message small mt-3 mb-0 text-${tone}`;
}

function formatDate(dateString, options) {
  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(dateString));
}

function getWeatherMeta(code) {
  return weatherCodeMap[code] || { label: 'Condição indisponível', icon: '🌈' };
}

function renderForecast(daily) {
  forecastList.innerHTML = '';

  daily.time.slice(0, 5).forEach((date, index) => {
    const meta = getWeatherMeta(daily.weathercode[index]);
    const item = document.createElement('article');
    item.className = 'forecast-item';
    item.innerHTML = `
      <div>
        <p class="day">${formatDate(date, { weekday: 'short' })}</p>
        <span class="fs-4" aria-hidden="true">${meta.icon}</span>
      </div>
      <div>
        <p class="day">${formatDate(date, { day: '2-digit', month: 'long' })}</p>
        <p class="details">${meta.label}</p>
      </div>
      <p class="temps">${Math.round(daily.temperature_2m_max[index])}° / ${Math.round(daily.temperature_2m_min[index])}°</p>
    `;
    forecastList.appendChild(item);
  });
}

function renderWeather(payload, locationLabel) {
  const { current, daily } = payload;
  const meta = getWeatherMeta(current.weathercode);

  elements.locationName.textContent = locationLabel;
  elements.currentDate.textContent = formatDate(current.time, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
  elements.currentDescription.textContent = meta.label;
  elements.currentTemp.textContent = Math.round(current.temperature_2m);
  elements.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
  elements.maxTemp.textContent = `${Math.round(daily.temperature_2m_max[0])}°C`;
  elements.minTemp.textContent = `${Math.round(daily.temperature_2m_min[0])}°C`;
  elements.humidity.textContent = `${current.relative_humidity_2m}%`;
  elements.windSpeed.textContent = `${Math.round(current.windspeed_10m)} km/h`;
  elements.precipitation.textContent = `${current.precipitation.toFixed(1)} mm`;
  elements.rainProbability.textContent = `${daily.precipitation_probability_max[0]}%`;
  elements.weatherIcon.textContent = meta.icon;

  renderForecast(daily);
}

async function fetchWeather(latitude, longitude, locationLabel) {
  setFeedback('Carregando dados meteorológicos...', 'primary');

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude,
    longitude,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weathercode',
      'windspeed_10m',
    ].join(','),
    daily: [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
    ].join(','),
    forecast_days: '5',
    timezone: 'auto',
  }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Não foi possível obter a previsão do tempo no momento.');
  }

  const payload = await response.json();
  renderWeather(payload, locationLabel);
  setFeedback(`Dados atualizados para ${locationLabel}.`, 'success');
}

async function searchCity(city) {
  setFeedback(`Buscando coordenadas para ${city}...`, 'primary');

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search = new URLSearchParams({
    name: city,
    count: '1',
    language: 'pt',
    format: 'json',
  }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Não foi possível pesquisar essa cidade.');
  }

  const payload = await response.json();
  const result = payload.results?.[0];

  if (!result) {
    throw new Error('Cidade não encontrada. Tente pesquisar por outro nome.');
  }

  const locationLabel = [result.name, result.admin1, result.country].filter(Boolean).join(', ');
  await fetchWeather(result.latitude, result.longitude, locationLabel);
}

async function detectCurrentLocation() {
  if (!navigator.geolocation) {
    throw new Error('Geolocalização não é suportada neste navegador.');
  }

  setFeedback('Solicitando sua localização...', 'primary');

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });

  const { latitude, longitude } = position.coords;
  await fetchWeather(latitude, longitude, 'Sua localização atual');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setFeedback('Digite o nome de uma cidade para continuar.', 'danger');
    return;
  }

  try {
    await searchCity(city);
  } catch (error) {
    setFeedback(error.message, 'danger');
  }
});

locationButton.addEventListener('click', async () => {
  try {
    await detectCurrentLocation();
  } catch (error) {
    setFeedback('Não foi possível acessar sua localização. Verifique as permissões do navegador.', 'danger');
  }
});

searchCity('São Paulo');
