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
    //CR: Пользуйся приведением типов.
    //CR: if (searchCity.value) {
    if (searchCity.value !== "") {
        let nameOfCity = searchCity.value;
        searchCity.value = "";
        document.getElementsByClassName("week")[0].innerHTML = "";
        document.getElementsByClassName("get_city")[0].innerHTML = "";
        return mainFunction(nameOfCity);
    }
});


//CR: Тут как-раз можно придумать название функции. Например showWeatherForCity. 
async function mainFunction(nameOfCity) {
    let weatherForWeek = await getWeatherFromAPI(nameOfCity);
    //CR: if (weatherForWeek) {
    if (weatherForWeek !== undefined) {
        for (let i = 0; i < 7; i++) {
            //CR: Обращай внимание на длину строки кода. Можно либо отформатировать, либо разбить на отдельные переменные.
            createsDayAndAddsToHTML(convertsWeekdayToID(new Date((weatherForWeek.daily[i].dt) * 1000)), new WeatherForDay(new Date((weatherForWeek.daily[i].dt) * 1000), weatherForWeek.daily[i].temp.max, weatherForWeek.daily[i].temp.min, weatherForWeek.daily[i].temp.morn, weatherForWeek.daily[i].temp.day, weatherForWeek.daily[i].temp.eve, weatherForWeek.daily[i].temp.night))
        }
        accentuatesToday();
    }
}

//CR: Всякие штуки, которые могут меняться, лучше не хардкодить, а получать откуда-то сверху. Тут речь про apiKey'и. В принципе их вообще в исходниках быть не должно.
async function getWeatherFromAPI(nameOfCity) {
    let responseWithCityCoordByCityName;

    //CR: Лучше пользоваться интерполяцией (`${value}`) строк вместо конкатенации (сложения). Так меньше вероятность допустить ошибку.
    //CR: Также писать `${nameOfCity}` бессмысленно, если кроме nameOfCity в данной строке ничего нет. Получится то же самое, что было.
    try {
        responseWithCityCoordByCityName = await fetch("https://api.openweathermap.org/data/2.5/weather" +
            "?q=" + `${nameOfCity}` + "&units=metric&lang=ru&appid=6b70c540feba0fdeebeb7eb39708b7e7", {method: "GET"});
        if (responseWithCityCoordByCityName.status !== 200) {
            throw new Error("Запрос завершился с ошибкой. Код ошибки:" + `${responseWithCityCoordByCityName.status}`)
        }
    } catch (e) {
        //CR: Ошибки лучше писать через console.error();
        console.log(e);
        showsErrorUnknownCity();
        return;
    }
    let objectWithCityCoordAndName = await responseWithCityCoordByCityName.json();
    let lon = objectWithCityCoordAndName.coord.lon;
    let lat = objectWithCityCoordAndName.coord.lat;
    let responseWithWeatherData = await fetch("https://api.openweathermap.org/data/2.5/" +
        "onecall?lat=" + `${lat}` + "&lon=" + `${lon}` + "&exclude=hourly," +
        "current,minutely,alerts&lang=ru&units=metric&appid=6b70c540feba0fdeebeb7eb39708b7e7", {method: "GET"});
    //CR: Тут аналогично может быть неуспешный код ответа и желательно это обрабатывать
    let objectWithWeatherData = await responseWithWeatherData.json();

    //CR: Вызов этой функции здесь лишний. getWeatherFromAPI всего лишь получает данные от api и ему незачем что-то знать про html.
    showCityNameAtHTML(objectWithCityCoordAndName.name);
    return objectWithWeatherData;
}

function showCityNameAtHTML(nameOfCity) {
    $('.get_city').append('<span id="get_city">' + nameOfCity + '</span>');
}

//CR: create, а не creates
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

//CR: switch, а не switches.
//CR: ну и по факту функция не переключает ничего, а навешивает обработчик. bindWeatherSwitching
function switchesWeather(nameOfDay) {
    //CR: Лучше использовать интерполяцию. Меньше вероятность ошибки при формировании селектора.
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

//CR: convert, а не converts
function convertsDateToWeekdayName(date) {
    //CR: В таких switch'ах лучше писать в конце default явно и кидать там ошибку, например.
    //CR: А то так он штатно вернет underfined в случае некорректных данных и код развалится где-то выше, либо что хуже, будет работать некорректно.
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

//CR: То же самое замечание, что выше
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

//CR: create, а не creates.
function createsDateForAddToHTML(date) {
    //CR: Нет смысла использовать и интерполяцию строк и сложение. Лучше использовать только интерполяцию:
    //CR: `${date.getDate()}.${date.getMonth()}.{date.getFullYear()}`
    return `${date.getDate()}` + "." + `${date.getMonth()}` + "." + `${date.getFullYear()}`
}

//CR: selectCurrentDay или addBorderForToday выглядят понятнее.
function accentuatesToday() {
    document.getElementsByClassName("days")[0].classList.add("now");
}

//CR: showError а не showsError. И лучше showUnknownCityError. Так грамотнее.
function showsErrorUnknownCity() {
    $('#error').fadeToggle();
    setTimeout(() => {
        $('#error').fadeToggle();
        $('#error').hidden = true;
    }, 3500);
}
