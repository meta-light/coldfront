const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const currentPredictionEl = document.getElementById('current-prediction');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';
let nextDate;

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'
    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);

getWeatherData()
function getWeatherData() {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=36.0647&lon=-94.1744&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data)
        console.log('Country & Timezone: ', data.timezone)
        showWeatherData(data);
    })
}

getPrediction()
function getPrediction() {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=36.0647&lon=-94.1744&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const rainAmount = data.daily[0].rain ? data.daily[0].rain : 0;
            const willCancel = rainAmount >= 0.5 ? '🚫' : '✅';
            console.log(`Will the baseball game be cancelled due to rain in Fayetteville, AR? ${willCancel}`);
            showPrediction(data, willCancel);
        })
        .catch(error => console.error(error));
}

function showPrediction(data, willCancel) {
    const nextDate = getNextDate();
    let rainChance = data.daily[0].pop ? `${data.daily[0].pop * 100}%` : '0%';
    currentPredictionEl.innerHTML =
        `<div class="weather-item">
        <div><b>Next Game:</b></div>
        <div><b>${nextDate}</b></div>
    </div>
    <div class="weather-item">
        <div><b>Chance of Rain at Baum-Walker:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></div>
        <div><b>${rainChance}</b></div>
    </div>
    <div class="weather-item">
        <div><b>Prediction of Game Status:&nbsp;</b></div>
        <div><b>${willCancel}</b></div>
    </div>`;
}

const gameData = {
    "game_dates": ["2023-02-17",
        "2023-02-18",
        "2023-02-19",
        "2023-02-21",
        "2023-02-24",
        "2023-02-25",
        "2023-02-26",
        "2023-03-01",
        "2023-03-03",
        "2023-03-04",
        "2023-03-05",
        "2023-03-07",
        "2023-03-10",
        "2023-03-11",
        "2023-03-12",
        "2023-03-14",
        "2023-03-15",
        "2023-03-17",
        "2023-03-18",
        "2023-03-19",
        "2023-03-21",
        "2023-03-28",
        "2023-03-31",
        "2023-04-01",
        "2023-04-02",
        "2023-04-04",
        "2023-04-11",
        "2023-04-12",
        "2023-04-14",
        "2023-04-15",
        "2023-04-16",
        "2023-04-18",
        "2023-04-27",
        "2023-04-28",
        "2023-04-29",
        "2023-05-12",
        "2023-05-13",
        "2023-05-14"]
};

function getNextDate() {
    const currentDate = new Date().toISOString().split('T')[0];
    return gameData.game_dates.find(date => date > currentDate);
}

getNextDate();

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
        <div><b>Fayetteville Current Conditions:</b></div>
    </div>
    <div class="weather-item">
        <div><b>Humidity</b></div>
        <div><b>${humidity}%</b></div>
    </div>
    <div class="weather-item">
        <div><b>Pressure</b></div>
        <div><b>${pressure} hPa</b></div>
    </div>
    <div class="weather-item">
        <div><b>Wind Speed</b></div>
        <div><b>${wind_speed} MPH</b></div>
    </div>
    <div class="weather-item">
        <div><b>Sunrise</b></div>
        <div><b>${window.moment(sunrise * 1000).format('H:mm a')}</b></div>
    </div>
    <div class="weather-item">
        <div><b>Sunset</b></div>
        <div><b>${window.moment(sunset * 1000).format('H:mm a')}</b></div>
    </div>`;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;F</div>
                <div class="temp">Day - ${day.temp.day}&#176;F</div>
            </div>`
        } else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;F</div>
                <div class="temp">Day - ${day.temp.day}&#176;F</div>
            </div>`
        }
    })
    weatherForecastEl.innerHTML = otherDayForcast;
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(registration => {
        console.log("Service Worker Registered");
        console.log(registration);
    }).catch(error => {
        console.log("Service Worker Registration Failed");
        console.log(error);
    });
}

var ath = addToHomescreen( {
    onShow: function () {
        console.log( "showing" );
    },
    onInit: function () {
        console.log( "initializing" );
    },
    onAdd: function () {
        console.log( "adding" );
    },
    onInstall: function () {
        console.log( "Installing" );
    },
    onCancel: function () {
        console.log( "Cancelling" );
    }
} );