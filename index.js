const searchCity = document.getElementById('set_city');
const weatherSearchButton = $('#getWeather');

class WeatherForDay {
    constructor(date, maxTemp, minTemp, morn, day, eve, night) {
        this.dayOfWeek = convertsDateToWeekdayName(date);
        this.maxTemp = maxTemp;
        this.minTemp = minTemp;
        this.morn = morn;
        this.day = day;
        this.eve = eve;
        this.night = night;
        this.date = createsDateForAddToHTML(date);
    }
}

weatherSearchButton.click(() => {
    let nameOfCity = searchCity.value;
    searchCity.value = "";
    document.getElementsByClassName("week")[0].innerHTML = "";
    document.getElementsByClassName("get_city")[0].innerHTML = "";
    return mainFunction(nameOfCity);
});

async function mainFunction(nameOfCity) {
    let weatherForWeek = await getWeatherFromAPI(nameOfCity);
    for (let i = 0; i < 7; i++) {
        createsDayAndAddsToHTML(convertsWeekdayToID(new Date((weatherForWeek.daily[i].dt) * 1000)), new WeatherForDay(new Date((weatherForWeek.daily[i].dt) * 1000), weatherForWeek.daily[i].temp.max, weatherForWeek.daily[i].temp.min, weatherForWeek.daily[i].temp.morn, weatherForWeek.daily[i].temp.day, weatherForWeek.daily[i].temp.eve, weatherForWeek.daily[i].temp.night))
    }
    accentuatesToday();
}

async function getWeatherFromAPI(nameOfCity) {
    let responseWithCityCoordByCityName = await fetch("https://api.openweathermap.org/data/2.5/weather" +
        "?q=" + `${nameOfCity}` + "&units=metric&lang=ru&appid=6b70c540feba0fdeebeb7eb39708b7e7", {method: "GET"});
    let objectWithCityCoordAndName = await responseWithCityCoordByCityName.json();
    let lon = objectWithCityCoordAndName.coord.lon;
    let lat = objectWithCityCoordAndName.coord.lat;
    let responseWithWeatherData = await fetch("https://api.openweathermap.org/data/2.5/" +
        "onecall?lat=" + `${lat}` + "&lon=" + `${lon}` + "&exclude=hourly," +
        "current,minutely,alerts&lang=ru&units=metric&appid=6b70c540feba0fdeebeb7eb39708b7e7", {method: "GET"});
    let objectWithWeatherData = await responseWithWeatherData.json();
    showCityNameAtHTML(objectWithCityCoordAndName.name);
    console.log(objectWithWeatherData);
    return objectWithWeatherData;
}

function showCityNameAtHTML(nameOfCity) {
    $('.get_city').append('<span id="get_city">' + nameOfCity + '</span>');
}

function createsDayAndAddsToHTML(nameOfDay, weatherForDay) {
    $('<div class="days"></div>').attr('id', nameOfDay).appendTo('.week');
    $(`#${nameOfDay}`).append('<div class="main">\n' +
        '            <div class="day">' + weatherForDay.dayOfWeek + '</div>\n' +
        '            <div class="main_info">\n' +
        '            <span class="max_day_temp">' + `${weatherForDay.maxTemp}` + '</span><br>\n' +
        '            <span class="min_day_temp">' + `${weatherForDay.minTemp}` + '</span>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="moreInfo">\n' +
        '            <div class="info" hidden>\n' +
        '                <span class="morn_temp">Утро: ' + `${weatherForDay.morn}` + '</span><br>\n' +
        '                <span class="day_temp">День: ' + `${weatherForDay.day}` + '</span><br>\n' +
        '                <span class="ev_temp">Вечер: ' + `${weatherForDay.eve}` + '</span><br>\n' +
        '                <span class="night_temp">Ночь: ' + `${weatherForDay.night}` + '</span>\n' +
        '            </div><br>\n' +
        '            <div class="date">' + `${weatherForDay.date}` + '</div>\n' +
        '        </div>');
    switchesWeather(nameOfDay);
}

function switchesWeather(nameOfDay) {
    let id = '#' + nameOfDay;
    $(`${id} .main_info`).click(function () {
        $(id + ' .info').slideDown();
        $(id + ' .main_info').slideUp();
        $(id + ' .main_info').hidden = true;
        $(id + ' .date').fadeToggle();
        $(id + ' .date').hidden = true;
    });
    $(id + ' .info').click(function () {
        $(id + ' .info').slideUp();
        $(id + ' .main_info').slideDown();
        $(id + ' .date').fadeToggle();
    });
}

function convertsDateToWeekdayName(date) {
    switch (date.getDay()) {
        case 0 :
        return "ВС";
        case 1 :
            return "ПН";
        case 2 :
            return "ВТ";
        case 3 :
            return "СР";
        case 4 :
            return "ЧТ";
        case 5 :
            return "ПТ";
        case 6 :
            return "СБ";
    }
}

function convertsWeekdayToID(date) {
    switch (date.getDay()) {
        case 0 :
            return "vs";
        case 1 :
            return "pn";
        case 2 :
            return "vt";
        case 3 :
            return "sr";
        case 4 :
            return "cht";
        case 5 :
            return "pt";
        case 6 :
            return "sb";
    }
}

function createsDateForAddToHTML(date) {
    return `${date.getDate()}`+"."+`${date.getMonth()}`+"."+`${date.getFullYear()}`
}

function accentuatesToday() {
    document.getElementsByClassName("days")[0].classList.add("now");
}

