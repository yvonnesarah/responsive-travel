// =========================
// 🌗 THEME TOGGLE BUTTON
// =========================

// Get theme toggle button from DOM
const themeBtn = document.getElementById("themeToggle");

// Load saved theme from localStorage on page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️"; // switch icon to light mode button
}

// Toggle theme on button click
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  // Update button icon based on current theme
  themeBtn.textContent = isDark ? "☀️" : "🌙";

  // Save theme preference
  localStorage.setItem("theme", isDark ? "dark" : "light");
};


// =========================
// ⬆️ SCROLL TO TOP BUTTON
// =========================

const topBtn = document.getElementById("topBtn");

// Show/hide button based on scroll position
window.onscroll = () => {
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
};

// Smooth scroll back to top
topBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


// =========================
// 🌤️ WEATHER HELPERS
// =========================

// Returns weather icon based on weather code
function getWeatherIcon(code) {
  if (code === 0) return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // clear sky
  if (code <= 3) return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"; // cloudy
  if (code <= 48) return "https://cdn-icons-png.flaticon.com/512/4005/4005901.png"; // fog
  return "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"; // rain/snow
}

// Calculates a simple comfort score based on humidity + wind
function getComfortScore(humidity, wind) {
  return Math.max(0, Math.round(100 - (humidity * 0.5 + wind)));
}


// =========================
// 🌦️ FETCH WEATHER DATA
// =========================

async function getWeather() {
  // Fetch weather data from Open-Meteo API
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?" +
    "latitude=48.85&longitude=2.35" +
    "&current_weather=true" +
    "&hourly=relative_humidity_2m" +
    "&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,weathercode" +
    "&timezone=Europe%2FParis"
  );

  const data = await res.json();

  // Extract relevant sections
  const current = data.current_weather;
  const hourly = data.hourly;
  const daily = data.daily;

  // Weather calculations
  const humidity = hourly.relative_humidity_2m[0];
  const wind = current.windspeed;
  const comfort = getComfortScore(humidity, wind);

  // =========================
  // 🌡️ CURRENT WEATHER UI
  // =========================

  document.getElementById("temp").innerText = `🌡️ ${current.temperature}°C`;

  document.getElementById("feelsLike").innerText =
    `🥶 Feels like: ${current.temperature - 1}°C`;

  document.getElementById("wind").innerText =
    `🌬️ Wind: ${wind} km/h`;

  document.getElementById("humidity").innerText =
    `💧 Humidity: ${humidity}%`;

  document.getElementById("sunrise").innerText =
    `🌅 Sunrise: ${daily.sunrise[0].slice(11, 16)}`;

  document.getElementById("sunset").innerText =
    `🌇 Sunset: ${daily.sunset[0].slice(11, 16)}`;

  document.getElementById("comfort").innerText =
    `✨ Comfort level: ${comfort}%`;

  // Set weather icon
  document.getElementById("weatherIcon").src =
    getWeatherIcon(current.weathercode);


  // =========================
  // 📅 5-DAY FORECAST
  // =========================

  const forecast = document.getElementById("forecast");
  forecast.innerHTML = ""; // clear old forecast

  data.daily.time.forEach((day, i) => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <p>${new Date(day).toLocaleDateString("en-GB", { weekday: "short" })}</p>
      <img src="${getWeatherIcon(data.daily.weathercode[i])}" />
      <p>${data.daily.temperature_2m_max[i]}° / ${data.daily.temperature_2m_min[i]}°</p>
    `;

    forecast.appendChild(card);
  });
}

// Run weather function on page load
getWeather();


// =========================
// ❤️ LIKE BUTTON SYSTEM
// =========================

document.querySelectorAll(".card").forEach((card, index) => {
  const btn = card.querySelector(".like-btn");
  const countEl = card.querySelector(".like-count");

  // Load saved likes from localStorage
  let savedLikes = localStorage.getItem("likes-" + index);
  if (savedLikes) {
    countEl.innerText = savedLikes + " likes";
  }

  // Handle like click
  btn.onclick = () => {
    let count = parseInt(countEl.innerText) || 0;
    count++;

    countEl.innerText = count + " likes";
    btn.classList.add("liked");
    btn.innerText = "❤️ Liked";

    // Save updated likes
    localStorage.setItem("likes-" + index, count);
  };
});


// =========================
// ⭐ STAR RATING SYSTEM
// =========================

document.querySelectorAll(".card").forEach((card, index) => {
  const stars = card.querySelectorAll(".rating span");
  const output = card.querySelector(".rating-value");

  // Load saved rating
  let saved = localStorage.getItem("rating-" + index);

  if (saved) {
    output.innerText = saved + "/5";
    highlightStars(stars, saved);
  }

  // Star click handler
  stars.forEach(star => {
    star.onclick = () => {
      const value = star.dataset.value;

      output.innerText = value + "/5";
      localStorage.setItem("rating-" + index, value);

      highlightStars(stars, value);
    };
  });
});

// Highlight selected stars visually
function highlightStars(stars, value) {
  stars.forEach(star => {
    const isActive = star.dataset.value <= value;

    star.style.opacity = "1";
    star.classList.toggle("active", isActive);
  });
}


// =========================
// 🗺️ MAP LOCATION SWITCHER
// =========================

// Change embedded Google Maps location
function goTo(place) {
  document.querySelector("iframe").src =
    `https://maps.google.com/maps?q=${place}&t=&z=13&output=embed`;
}


// =========================
// 🕒 LIVE PARIS TIME CLOCK
// =========================

function updateTime() {
  const now = new Date();

  // Convert to Paris timezone
  const parisTime = now.toLocaleTimeString("en-GB", {
    timeZone: "Europe/Paris"
  });

  document.getElementById("time").innerText = "Paris time: " + parisTime;
}

// Update clock every second
setInterval(updateTime, 1000);


// =========================
// ✨ SCROLL FADE-IN EFFECT
// =========================

const faders = document.querySelectorAll(".fade-in");

window.addEventListener("scroll", () => {
  faders.forEach(el => {
    const top = el.getBoundingClientRect().top;

    // Trigger animation when element enters viewport
    if (top < window.innerHeight - 50) {
      el.classList.add("show");
    }
  });
});