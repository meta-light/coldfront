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
const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';
let nextDate;

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'
    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data)
        showWeatherData(data);
        })
    })
}

getPrediction()
function getPrediction() {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=36.0647&lon=-94.1744&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        const rainAmount = data.daily[0].rain ? data.daily[0].rain : 0;
        const willCancel = rainAmount >= 0.5 ? '✅' : '🚫';
        console.log(`Will the baseball game be cancelled due to rain in Fayetteville, AR? ${willCancel}`);
        showPrediction(data, willCancel);
    })
    .catch(error => console.error(error));
}

function showPrediction(data, willCancel) {
    let rainChance = data.daily[0].pop ? `${data.daily[0].pop * 100}%` : '0%';
    currentPredictionEl.innerHTML = 
    `<div class="weather-item">
        <div>Next Game:</div>
        <div>${nextDate}</div>
    </div>
    <div class="weather-item">
        <div>Chance of Rain at Baum-Walker:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div>${rainChance}</div>
    </div>
    <div class="weather-item">
        <div>Razorbacks Game Status:&nbsp;</div>
        <div>${willCancel}</div>
    </div>`;
}

function getNextDate() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const gameData = JSON.parse(xhr.responseText);
        // Get the current date
        const currentDate = new Date().toISOString().split('T')[0];
        // Find the next date in the game_dates array
        nextDate = gameData.game_dates.find(date => date > currentDate); // Assign value to global variable
        // Log the next date to the console
        console.log('Next Date:', nextDate);
      } else {
        console.error('Failed to fetch game data:', xhr.statusText);
      }
    }
  };
  // Open and send the request to fetch the JSON data
  xhr.open('GET', 'gamedata.json', true);
  xhr.send();
}

getNextDate();

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'
    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Your Current Conditions:</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} MPH</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('H:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('H:mm a')}</div>
    </div>`;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;F</div>
                <div class="temp">Day - ${day.temp.day}&#176;F</div>
            </div>`
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;F</div>
                <div class="temp">Day - ${day.temp.day}&#176;F</div>
            </div>`
        }
    })
    weatherForecastEl.innerHTML = otherDayForcast;
}