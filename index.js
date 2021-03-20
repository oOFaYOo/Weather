// let api = "https://api.openweathermap.org/data/2.5/" +
//     "onecall?lat=33.441792&lon=-94.037689&exclude=hourly," +
//     "current,minutely,alerts&lang=ru&units=metric&appid=6b70c540feba0fdeebeb7eb39708b7e7";


function draw(nameOfDay) {
    $('<div class="days"></div>').attr('id', nameOfDay).appendTo('.week');
    $(`#${nameOfDay}`).append('<div class="main">\n' +
        '            <div class="day">Пн</div>\n' +
        '            <div class="main_info">\n' +
        '            <span class="max_day_temp">-2</span><br>\n' +
        '            <span class="min_day_temp">-9</span>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="moreInfo">\n' +
        '            <div class="info" hidden>\n' +
        '                <span class="morn_temp">Утро: -15</span><br>\n' +
        '                <span class="day_temp">День: -5</span><br>\n' +
        '                <span class="ev_temp">Вечер: -10</span><br>\n' +
        '                <span class="night_temp">Ночь: -17</span>\n' +
        '            </div>\n' +
        '        </div>');
    slide(nameOfDay);
}

draw("pn");

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

