
const searchCity = document.getElementById('set_city');
const weatherSearchButton = $('#getWeather');
const apiKey = "6b70c540feba0fdeebeb7eb39708b7e7";

class WeatherForDay {
    constructor(date, maxTemp, minTemp, morn, day, eve, night) {
        this.dayOfWeek = convertDateToWeekdayName(date);
        this.maxTemp = maxTemp;
        this.minTemp = minTemp;
        this.morn = morn;
        this.day = day;
        this.eve = eve;
        this.night = night;
        this.date = createDateForAddToHTML(date);
    }
}

weatherSearchButton.click(() => {
    if (searchCity.value) {
        let nameOfCity = searchCity.value;
        searchCity.value = "";
        document.getElementsByClassName("week")[0].innerHTML = "";
        document.getElementsByClassName("get_city")[0].innerHTML = "";
        return showWeatherForCity(nameOfCity);
    }
});

async function showWeatherForCity(nameOfCity) {
    let responseWithWeatherForWeek = await getWeatherFromAPI(nameOfCity, apiKey);
    if (responseWithWeatherForWeek) {
        let weatherForWeek = responseWithWeatherForWeek.objectWithWeatherData;
        for (let i = 0; i < 7; i++) {
            let date = new Date((weatherForWeek.daily[i].dt) * 1000);
            let id = convertWeekdayToID(date);
            let weatherForDay = new WeatherForDay(
                date,
                weatherForWeek.daily[i].temp.max,
                weatherForWeek.daily[i].temp.min,
                weatherForWeek.daily[i].temp.morn,
                weatherForWeek.daily[i].temp.day,
                weatherForWeek.daily[i].temp.eve,
                weatherForWeek.daily[i].temp.night);
            createDayAndAddsToHTML(id, weatherForDay);
            bindWeatherSwitching(id);
        }
        showCityNameAtHTML(responseWithWeatherForWeek.nameOfCityForHTML);
        addBorderForToday();
    }
}

async function getWeatherFromAPI(nameOfCity, apiKey) {
    let responseWithCityCoordByCityName;
    try {
        responseWithCityCoordByCityName = await fetch("https://api.openweathermap.org/data/2.5/weather" +
            `?q=${nameOfCity}&units=metric&lang=ru&appid=${apiKey}`, {method: "GET"});
        if (responseWithCityCoordByCityName.status !== 200) {
            throw new Error(`Запрос завершился с ошибкой. Код ошибки: ${responseWithCityCoordByCityName.status}`)
        }
    } catch (e) {
        console.error(e);
        showUnknownCityError();
        return;
    }
    let objectWithCityCoordAndName = await responseWithCityCoordByCityName.json();
    let lon = objectWithCityCoordAndName.coord.lon;
    let lat = objectWithCityCoordAndName.coord.lat;
    let responseWithWeatherData;
    try {
    responseWithWeatherData = await fetch("https://api.openweathermap.org/data/2.5/" +
        `onecall?lat=${lat}&lon=${lon}&exclude=hourly,` +
        `current,minutely,alerts&lang=ru&units=metric&appid=${apiKey}`, {method: "GET"});
        if (responseWithWeatherData.status !== 200) {
            throw new Error(`Запрос завершился с ошибкой. Код ошибки: ${responseWithWeatherData.status}`)
        }
    } catch (e) {
        console.error(e);
        return;
    }
    let objForResult = {
        nameOfCityForHTML : objectWithCityCoordAndName.name,
        objectWithWeatherData: await responseWithWeatherData.json(),
    };
    return objForResult;
}

function showCityNameAtHTML(nameOfCity) {
    $('.get_city').append(`<span id="get_city">${nameOfCity}</span>`);
}

function createDayAndAddsToHTML(nameOfDay, weatherForDay) {
    $('<div class="days"></div>').attr('id', nameOfDay).appendTo('.week');
    $(`#${nameOfDay}`).append('<div class="main">\n' +
        `            <div class="day">${weatherForDay.dayOfWeek}</div>\n` +
        '            <div class="main_info">\n' +
        `            <span class="max_day_temp">${weatherForDay.maxTemp}</span><br>\n` +
        `            <span class="min_day_temp">${weatherForDay.minTemp}</span>\n` +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="moreInfo">\n' +
        '            <div class="info" hidden>\n' +
        `                <span class="morn_temp">Утро: ${weatherForDay.morn}</span><br>\n` +
        `                <span class="day_temp">День: ${weatherForDay.day}</span><br>\n` +
        `                <span class="ev_temp">Вечер: ${weatherForDay.eve}</span><br>\n` +
        `                <span class="night_temp">Ночь: ${weatherForDay.night}</span>\n` +
        '            </div><br>\n' +
        `            <div class="date">${weatherForDay.date}</div>\n` +
        '        </div>');
}

function bindWeatherSwitching(nameOfDay) {
    $(`#${nameOfDay} .main_info`).click(function () {
        $(`#${nameOfDay} .info`).slideDown();
        $(`#${nameOfDay} .main_info`).slideUp().hidden = true;
        $(`#${nameOfDay} .date`).fadeToggle().hidden = true;
    });
    $(`#${nameOfDay} .info`).click(function () {
        $(`#${nameOfDay} .info`).slideUp();
        $(`#${nameOfDay} .main_info`).slideDown();
        $(`#${nameOfDay} .date`).fadeToggle();
    });
}

function convertDateToWeekdayName(date) {
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
        default:
            throw new Error(`Unknown day type: ${date.getDay()}`);
    }
}

function convertWeekdayToID(date) {
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
        default:
            throw new Error(`Unknown day type: ${date.getDay()}`);
    }
}

function createDateForAddToHTML(date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

function addBorderForToday() {
    document.getElementsByClassName("days")[0].classList.add("now");
}

function showUnknownCityError() {
    $('#error').fadeToggle();
    setTimeout(() => {
        $('#error').fadeToggle().hidden = true;
    }, 3500);
}
