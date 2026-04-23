// =========================
// 🌗 THEME TOGGLE
// =========================
const themeBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
};


// =========================
// ⬆️ SCROLL TO TOP
// =========================
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


// =========================
// 📊 SCROLL PROGRESS BAR
// =========================
window.addEventListener("scroll", () => {
  const height = document.body.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / height) * 100;

  document.getElementById("progressBar").style.width = progress + "%";
});


// =========================
// 🕒 PARIS LIVE TIME
// =========================
function updateTime() {
  const now = new Date();

  const parisTime = now.toLocaleTimeString("en-GB", {
    timeZone: "Europe/Paris"
  });

  document.getElementById("time").innerText =
    "Paris time: " + parisTime;
}

setInterval(updateTime, 1000);


// =========================
// 🌤️ WEATHER HELPERS
// =========================
function getWeatherIcon(code) {
  if (code === 0) return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
  if (code <= 3) return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
  if (code <= 48) return "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
  return "https://cdn-icons-png.flaticon.com/512/3351/3351979.png";
}

function getComfortScore(humidity, wind) {
  return Math.max(0, Math.round(100 - (humidity * 0.5 + wind)));
}


// =========================
// 🌦️ WEATHER FETCH
// =========================
const loader = document.getElementById("loader");

async function getWeather() {
  try {
    loader.style.display = "block";

    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?" +
      "latitude=48.85&longitude=2.35" +
      "&current_weather=true" +
      "&hourly=relative_humidity_2m" +
      "&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode" +
      "&timezone=Europe%2FParis"
    );

    const data = await res.json();

    const current = data.current_weather;
    const humidity = data.hourly.relative_humidity_2m[0];
    const daily = data.daily;
    const wind = current.windspeed;

    const comfort = getComfortScore(humidity, wind);

    document.getElementById("temp").innerText =
      `🌡️ ${current.temperature}°C`;

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

    document.getElementById("weatherIcon").src =
      getWeatherIcon(current.weathercode);

    const forecast = document.getElementById("forecast");
    forecast.innerHTML = "";

    daily.time.forEach((day, i) => {
      const card = document.createElement("div");
      card.classList.add("forecast-card");

      card.innerHTML = `
        <p>${new Date(day).toLocaleDateString("en-GB", { weekday: "short" })}</p>
        <img src="${getWeatherIcon(daily.weathercode[i])}" />
        <p>${daily.temperature_2m_max[i]}° / ${daily.temperature_2m_min[i]}°</p>
      `;

      forecast.appendChild(card);
    });

  } catch (err) {
    console.error("Weather error:", err);
  } finally {
    loader.style.display = "none";
  }
}

getWeather();


// =========================
// 🔔 TOAST SYSTEM (UPDATED)
// =========================
const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}


// =========================
// ❤️ LIKE SYSTEM (WITH TOAST)
// =========================
document.querySelectorAll(".card").forEach((card, index) => {
  const btn = card.querySelector(".like-btn");
  const countEl = card.querySelector(".like-count");

  let savedLikes = localStorage.getItem("likes-" + index);
  if (savedLikes) {
    countEl.innerText = savedLikes + " likes";
  }

  btn.onclick = () => {
    let count = parseInt(countEl.innerText) || 0;
    count++;

    countEl.innerText = count + " likes";
    btn.classList.add("liked");
    btn.innerText = "❤️ Liked";

    localStorage.setItem("likes-" + index, count);

    const cafeName = card.querySelector("h4").innerText;
    showToast(`❤️ ${cafeName} added to favorites`);
  };
});


// =========================
// ⭐ STAR RATING (WITH TOAST)
// =========================
document.querySelectorAll(".card").forEach((card, index) => {
  const stars = card.querySelectorAll(".rating span");
  const output = card.querySelector(".rating-value");

  let saved = localStorage.getItem("rating-" + index);

  if (saved) {
    output.innerText = saved + "/5";
    highlightStars(stars, saved);
  }

  stars.forEach(star => {
    star.onclick = () => {
      const value = star.dataset.value;

      output.innerText = value + "/5";
      localStorage.setItem("rating-" + index, value);

      highlightStars(stars, value);

      const cafeName = card.querySelector("h4").innerText;
      showToast(`⭐ You rated ${cafeName} ${value}/5`);
    };
  });
});

function highlightStars(stars, value) {
  stars.forEach(star => {
    const isActive = star.dataset.value <= value;
    star.classList.toggle("active", isActive);
  });
}


// =========================
// 🔍 SEARCH FILTER
// =========================
const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("input", e => {
    const val = e.target.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {
      card.style.display =
        card.innerText.toLowerCase().includes(val) ? "block" : "none";
    });
  });
}


// =========================
// 🗺️ MAP LOCATION SAVE
// =========================
function goTo(place) {
  const url = `https://maps.google.com/maps?q=${place}&output=embed`;
  document.querySelector("iframe").src = url;

  localStorage.setItem("map-location", place);
}

const savedPlace = localStorage.getItem("map-location");
if (savedPlace) goTo(savedPlace);


// =========================
// ✨ FADE-IN ON SCROLL
// =========================
const faders = document.querySelectorAll(".fade-in");

window.addEventListener("scroll", () => {
  faders.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < window.innerHeight - 50) {
      el.classList.add("show");
    }
  });
});
