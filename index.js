//Open Weather API Key
var key = "c74302d7d8a8a667a704248f08dedd0b";

//city variables
var cityList = $("#city-list");
var cities = [];
var searchHistory = JSON.parse(localStorage.getItem("cities"));

//get current date and time
function FormatDay(date) {
    var date = new Date();
    var day = date.getDate();
    var dayOutput = date
    return dayOutput;
}

//initiate search function
init();

function init() {
    if (searchHistory !== null) {
        cities = searchHistory;
    }
    renderCities();
}

//Save cities in local storage
function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
}

//render searched city function
function renderCities() {
    cityList.empty();

    // Render a new li for each city
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var li = $("<li>").text(city);
        li.attr("id", "listC");
        li.attr("data-city", city);
        li.attr("class", "list-group-item");
        console.log(li);
        cityList.prepend(li);
    }
    //Only render the latest searched city
    if (!city) {
        return
    }
    else {
        getCurrentWeather(city)
        renderforecast(city);
    };
}

$("#add-city").on("click", function (event) {
    event.preventDefault();

    var city = $("#city-input").val().trim();

    if (city === "") {
        return;
    }

    cities.push(city);

    storeCities();
    renderCities();
});

//get curent weather function
function getCurrentWeather(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key;
    $("#today-weather").empty();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        cityTitle = $("<h3>").text(response.name + " // " + " " + FormatDay());
        $("#today-weather").append(cityTitle);

        var weatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
        $("#today-weather").append(weatherIcon);

        var TempetureToNum = parseInt((response.main.temp) * 9 / 5 - 459);
        var cityTemperature = $("<p>").text("Tempeture: " + TempetureToNum + "°F");
        $("#today-weather").append(cityTemperature);

        var cityHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        $("#today-weather").append(cityHumidity);

        var cityWindSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " mph");
        $("#today-weather").append(cityWindSpeed);

        var CoordLon = response.coord.lon;
        var CoordLat = response.coord.lat;

        //Get UV index
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + CoordLat + "&lon=" + CoordLon;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (responseuv) {
            var cityUV = $("<span>").text(responseuv.value);
            var cityUVp = $("<p>").text("UV Index: ");
            cityUVp.append(cityUV);
            $("#today-weather").append(cityUVp);

            //conditions to change colors
            if (responseuv.value > 0 && responseuv.value <= 2) {
                cityUV.attr("class", "green")
            }
            else if (responseuv.value > 2 && responseuv.value <= 5) {
                cityUV.attr("class", "yellow")
            }
            else if (responseuv.value > 5 && responseuv.value <= 7) {
                cityUV.attr("class", "orange")
            }
            else if (responseuv.value > 7 && responseuv.value <= 10) {
                cityUV.attr("class", "red")
            }
            else {
                cityUV.attr("class", "purple")
            }
        });

      });
    }
    
//get 5-day forecast function
function renderforecast(cityName) {
    var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cities + "&appid=" + key;
    $("#forecast").empty();
    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function (data) {
      $("#forecast").append("<div class=\"row\">");
      for (var i = 0; i < 5; i++) {
            var fiveDate = $("<h4>").addClass("card-text").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var weatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var colFive = $("<div>").addClass("card-body");
            var cardFive = $("<div>").addClass("card-md-2 bg-primary text-white");
            var cardBodyFive = $("<div>").addClass("card-body p-2");
            var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
            var tempFive = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp + " °F");
            // if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                colFive.append(cardFive.append(cardBodyFive.append(fiveDate, weatherIcon, tempFive, humidFive)));
                $("#forecast > .row").append(colFive);
            // }
        }
    });
}

//Click function to each Li 
$(document).on("click", "#listC", function () {
    var thisCity = $(this).attr("data-city");
    getCurrentWeather(thisCity);
    renderforecast(thisCity);
});















