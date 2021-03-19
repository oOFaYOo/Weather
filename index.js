// let api = "https://api.openweathermap.org/data/2.5/" +
//     "onecall?lat=33.441792&lon=-94.037689&exclude=hourly," +
//     "current,minutely,alerts&lang=ru&units=metric&appid=6b70c540feba0fdeebeb7eb39708b7e7";


// $('div#pn div.main_info').click(function () {
//     $('div#pn div.info').slideDown();
//     $('div#pn div.main_info').slideUp();
//     $('div#pn div.main_info').hidden = true;
// });
//
// $('div#pn div.info').click(function () {
//     $('div#pn div.info').slideUp();
//     $('div#pn div.main_info').slideDown();
// });

$('.main_info').click(function () {
    $('.info').slideDown();
    $('.main_info').slideUp();
    $('.main_info').hidden = true;
});

$('.info').click(function () {
    $('.info').slideUp();
    $('.main_info').slideDown();
});
