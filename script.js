document.addEventListener('DOMContentLoaded', function () {
  const cityInput = document.getElementById('city-input');
  const searchButton = document.getElementById('search-bar');
  const weatherCard = document.querySelector('.weather-card');
  const headerHover = document.querySelector('.before-api');
  const defaultCity = "Bordeaux"; // Change defaultCity with your city's name !

  handleSearch(); 

  searchButton.addEventListener('click', handleSearch);

  function handleSearch() {
      

      let cityName = cityInput.value || defaultCity; 

      if (cityName.trim() !== "") {
          fetchWeatherData(cityName)
              .then(weatherData => {
                  updateWeatherUI(weatherData);
                  updateWeatherAudioAndSvg(weatherData);
                  fetchAndDisplayImage(cityName);
                  weatherCard.classList.add('hovered');
                  headerHover.classList.remove('before-api');
              })
              .catch(error => {
                  console.error('An error occurred', error);
              });
      }
  }

  function fetchWeatherData(cityName) {
      const apiKey = "13d52f84b2513edfbaddc7217b4909c4";
      const apiCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

      return fetch(apiCoordinates)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Error with API request');
              }
              return response.json();
          })
          .then(data => {
              const latitude = data[0].lat;
              const longitude = data[0].lon;
              const apiHistory = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
              return fetch(apiHistory);
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Error with API request');
              }
              return response.json();
          });
  }

  function updateWeatherUI(weatherData) {
      document.getElementById("descr").textContent = weatherData.weather[0].main.charAt(0).toUpperCase() + weatherData.weather[0].main.slice(1);
      document.getElementById("temperature").textContent = weatherData.main.temp + " °C";
      document.getElementById("country").textContent = weatherData.sys.country;
      document.getElementById("temp-max").textContent = "Today max's temperature: " + weatherData.main.temp_max + " °C";
      document.getElementById("temp-min").textContent = "Today min's temperature: " + weatherData.main.temp_min + " °C";
      document.getElementById("humidity").textContent = "Humidity: " + weatherData.main.humidity + " %";
      document.getElementById("wind-speed").textContent = "Wind Speed: " + weatherData.wind.speed + "km/h";
      const cityName = cityInput.value.trim() || defaultCity; 
      document.getElementById("city-name").textContent = cityName;

      const flag = weatherData.sys.country;
      const flagContainer = document.getElementById("flag-container");
      flagContainer.className = "";
      flagContainer.classList.add("flag-icon", `flag-icon-${flag.toLowerCase()}`);
  }

  function updateWeatherAudioAndSvg(weatherData) {
    const weather = weatherData.weather[0].main.toLowerCase();
    const audioElement = document.getElementById("weather-audio");
    const weatherSvg = document.getElementById("svg");
    const audioSource = selectAudioAndSvg(weather);
    const svgSource = selectAudioAndSvg(weather, weatherSvg);
    
    audioElement.removeAttribute('controls');
    audioElement.src = audioSource;
    weatherSvg.src = svgSource;
}

function selectAudioAndSvg(weather, svg) {
    switch (weather) {
        case "rain":
            return svg ? "assets/svg/rain.svg" : "assets/songs/rain.mp3";
        case "clear":
            return svg ? "assets/svg/clear.svg" : "assets/songs/clear.mp3";
        case "clouds":
            return svg ? "assets/svg/clouds.svg" : "assets/songs/clouds.mp3";
        case "mist":
            return svg ? "assets/svg/mist.svg" : "assets/songs/mist.mp3";
        case "snow":
            return svg ? "assets/svg/snow.svg" : "assets/songs/snow.mp3";
        default:
            return "";
    }
}


  function fetchAndDisplayImage(cityName) {
      const accessKey = '-WFVVUIMTTlYcPJAe_fMf8OHQlIxuIdvEWmCQnloVAk';
      const query = `${cityName}`;
      const apiImage = `https://api.unsplash.com/search/photos?query=${query}&w=1920&h=1080`;

      fetch(apiImage, {
          headers: {
              Authorization: `Client-ID ${accessKey}`,
              'Accept-Version': 'v1',
          }
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              const random = Math.floor(Math.random() * 10);
              const img = data.results[random].urls.regular;
              const myImage = document.getElementById("img");
              myImage.style.backgroundImage = `url(${img})`;
          });
  }
});
