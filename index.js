
// function draw(nameOfDay , weatherDay) {
//     $('<div class="days"></div>').attr('id', nameOfDay).appendTo('.week');
//     $(`#${nameOfDay}`).append('<div class="main">\n' +
//         '            <div class="day">'+`${weatherDay}`+'</div>\n' +
//         '            <div class="main_info">\n' +
//         '            <span class="max_day_temp">-2</span><br>\n' +
//         '            <span class="min_day_temp">-9</span>\n' +
//         '            </div>\n' +
//         '        </div>\n' +
//         '        <div class="moreInfo">\n' +
//         '            <div class="info" hidden>\n' +
//         '                <span class="morn_temp">Утро: -15</span><br>\n' +
//         '                <span class="day_temp">День: -5</span><br>\n' +
//         '                <span class="ev_temp">Вечер: -10</span><br>\n' +
//         '                <span class="night_temp">Ночь: -17</span>\n' +
//         '            </div>\n' +
//         '        </div>');
//     slide(nameOfDay);
// }


const setCity = document.getElementById('set_city');
const getWeatherButton = $('#getWeather');

getWeatherButton.click(() => {
        if (setCity.value !== "") {
            return nazvanie(setCity.value)
        }
    }
);


async function nazvanie(nameOfCity){
    let weatherWeek = await getWeatherFromApi(nameOfCity); //вернет объект с данными по темпиратурке, а не промис
    for(let i = 0; i < 7; i++){
        draw(getNameIDOfDay(new Date((weatherWeek.daily[i].dt)*1000).getDay()), new WeatherDay(new Date((weatherWeek.daily[i].dt)*1000).getDay(), weatherWeek.daily[i].temp.max, weatherWeek.daily[i].temp.min, weatherWeek.daily[i].temp.morn, weatherWeek.daily[i].temp.day, weatherWeek.daily[i].temp.eve, weatherWeek.daily[i].temp.night))
    }
}


async function getWeatherFromApi(nameOfCity) {
    let response0 = await fetch("http://api.openweathermap.org/data/2.5/" +
        "weather?q="+`${nameOfCity}`+"&units=metric&lang=ru&appid=6b70c540feba0fdeebeb7eb39708b7e7", {method: "GET"});
    let response1 = await response0.json();
    let lon = response1.coord.lon;
    let lat = response1.coord.lat;
    let response2 = await fetch("https://api.openweathermap.org/data/2.5/" +
        "onecall?lat="+`${lat}`+"&lon="+`${lon}`+"&exclude=hourly," +
        "current,minutely,alerts&lang=ru&units=metric&appid=6b70c540feba0fdeebeb7eb39708b7e7", {method:"GET"});
    let response3 = await response2.json();
    drawGetCity(response1.name);
    console.log(response3);
    return response3;
}

function drawGetCity(nameOfCity) {
    $('.get_city').append('<span id="get_city">'+nameOfCity+'</span>');
}


function draw(nameOfDay , weatherDay) {
    $('<div class="days"></div>').attr('id', nameOfDay).appendTo('.week');
    $(`#${nameOfDay}`).append('<div class="main">\n' +
        '            <div class="day">'+weatherDay.weekDay+'</div>\n' +
        '            <div class="main_info">\n' +
        '            <span class="max_day_temp">'+`${weatherDay.maxTemp}`+'</span><br>\n' +
        '            <span class="min_day_temp">'+`${weatherDay.minTemp}`+'</span>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="moreInfo">\n' +
        '            <div class="info" hidden>\n' +
        '                <span class="morn_temp">Утро: '+`${weatherDay.morn}`+'</span><br>\n' +
        '                <span class="day_temp">День: '+`${weatherDay.day}`+'</span><br>\n' +
        '                <span class="ev_temp">Вечер: '+`${weatherDay.eve}`+'</span><br>\n' +
        '                <span class="night_temp">Ночь: '+`${weatherDay.night}`+'</span>\n' +
        '            </div>\n' +
        '        </div>');
    slide(nameOfDay);
}



function slide (nameOfDay) {
    let id = '#'+ nameOfDay;
    $(`${id} .main_info`).click(function () {
        $(id + ' .info').slideDown();
        $(id + ' .main_info').slideUp();
        $(id + ' .main_info').hidden = true;
    });

    $(id + ' .info').click(function () {
        $(id + ' .info').slideUp();
        $(id + ' .main_info').slideDown();
    });
}

class WeatherDay {
    constructor(weekDay, maxTemp, minTemp, morn, day, eve, night) {
        this.weekDay = getNameOfDay(weekDay);
        this.maxTemp = maxTemp;
        this.minTemp = minTemp;
        this.morn = morn;
        this.day = day;
        this.eve = eve;
        this.night = night;
    }
}

function getNameOfDay(num) {
    switch (num) {
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

function getNameIDOfDay(num) {
    switch (num) {
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