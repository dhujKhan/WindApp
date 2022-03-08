


$(document).ready(() => {
    var domElements =  {
        LiveWindInfoBtn: "#submit-btn",
        ForecastBtn: "#forecast-btn",
        searchBoxVal: "#search-value-city",
        cityName: ".city-name",
        windSpeed: ".wind-container .wind-speed",
        windDeg: ".wind-container .wind-degree",
        windGust: ".wind-container .wind-gust",
        mainWeatherContainer: ".main-weather-container",
        ForecastListCollection: ".forecast-container .forecast-list-collection",
        ForecastContainer: ".forecast-container",
        ErrorContent: "#error-details .error-content",
        FavBtn: ".fav-btn",
        SubmitFavBtn: "#submit-fav-btn",
        FavCityListContainer: ".fav-city-list-container",
        ViewDetails: ".view-details",
        FavCityName: ".fav-city-name",
        RemoveFavCity: ".remove-fav-city"



    }
    displayFavouritesList();
    $(domElements.LiveWindInfoBtn).on("click", (e) => {
        var serachString = $(e.currentTarget).parent().siblings().find(domElements.searchBoxVal).val();
        validate(serachString) ? getCurrentWeatherData(serachString) : "";
       
    });

    $(domElements.ForecastBtn).on("click", (e) => {
        var serachString = $(e.currentTarget).parent().siblings().find(domElements.cityName).text();
        getWindForecast(serachString);
    });

    function getCurrentWeatherData(city) {
        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=8e048959f155afc8d5e7a462ad84474b"
        $.ajax({
            type: "GET",
            url: url,
            success: function (data) {
                displayWeatherData(data);
              
            },
            error: function (error) {
                console.log(error);
                displayErrorMessage(error);
            }
        });
    }

    function getWindForecast(city) {
        var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=8e048959f155afc8d5e7a462ad84474b"
        $.ajax({
            type: "GET",
            url: url,
            success: function (data) {
                console.log(data);
                displayForecastData(data);

            },
            error: function (error) {
                console.log(error);
               
            }
        });
    }

    function displayWeatherData(data) {
        clearDisplay();
        var cityName = data.name;
        var windSpeed = data.wind.speed ? "Wind Speed: " + data.wind.speed + " metre/sec" : "";
        var windTemp = data.wind.deg ? "Wind Dec: " + data.wind.deg + " degree" : "";
        var windGust = data.wind.gust ? "Wind Gust: " + data.wind.gust + " metre/sec" : "";
        $(domElements.cityName).html("").append(cityName);
        $(domElements.windSpeed).html("").append(windSpeed);
        $(domElements.windDeg).html("").append(windTemp);
        $(domElements.windGust).html("").append(windGust);
        $(domElements.mainWeatherContainer).removeClass("hide");
        setFavBtnState(cityName);
       
    }

    function displayForecastData(data) {
        $(domElements.ForecastListCollection).html("");
        for (var i = 0; i < data.list.length; i++) {
            var forecastDateTime = data.list[i].dt_txt + "</br>";
            var windSpeed = "Wind Speed: " + data.list[i].wind.speed + " metre/sec";
            var windTemp = "Wind Dec: " + data.list[i].wind.deg + " degree";
            var windGust = "Wind Gust: " + data.list[i].wind.gust + " metre/sec";
            var forecastData = windSpeed + "</br>" + windTemp + "</br>" + windGust + " metre/sec";
            var forecastList = "<div class='forecast-list'>" + forecastDateTime + forecastData + "</div>";
            $(domElements.ForecastListCollection).append(forecastList);
        }
        $(domElements.ForecastContainer).removeClass("hide");
    }
    function clearDisplay() {
        $(domElements.cityName).html("");
        $(domElements.windSpeed).html("");
        $(domElements.windDeg).html(""); $(".wind-container .wind-gust").html("");
        $(domElements.ErrorContent).html("");
        $(domElements.ForecastListCollection).html("");
        $(domElements.ForecastContainer).addClass("hide");
        $(domElements.mainWeatherContainer).addClass("hide");
        $(domElements.FavBtn).addClass("hide");

    }

    function validate(inputText) {
        var validationMsg = "";
        var isValidCity = true;
        if (inputText === "") {
            validationMsg = "Please enter a valid city to continue."
            $(domElements.ErrorContent).html("").append(validationMsg);
            isValidCity = false;
        }
        return isValidCity;
    }
    function displayErrorMessage(error) {
        clearDisplay()
        var errorDetails = error.status + ":" + error.statusText;
        $(domElements.ErrorContent).html("").append(errorDetails);
    }

    function setFavBtnState(cityName) {
        var favArr = new Array();
        cityName = cityName.toLowerCase();
        favArr = JSON.parse(localStorage.getItem("favourites"));
        if (favArr) {
            if (favArr.indexOf(cityName) !== -1) {
                $(domElements.SubmitFavBtn).addClass("active");
            } else {
                $(domElements.SubmitFavBtn).removeClass("active");
            }
            $(domElements.FavBtn).removeClass("hide");
        }
        
        
    }
    function handleFavClick(e) {
        if ($(e.currentTarget).hasClass("active")) {
            $(e.currentTarget).removeClass("active")
            removeFavourites($(domElements.cityName).text());
           
        } else {
            $(e.currentTarget).addClass("active");
            currentAddFav($(domElements.cityName).text());
        }
        $(e.currentTarget).parent().removeClass("hide");
       
    }

    function currentAddFav(cityName) {
        if (localStorage.getItem('favourites')) {//If there are favourites
            var storage = JSON.parse(localStorage['favourites']);
            if (storage.indexOf(cityName.toLowerCase()) == -1) {
 
                storage.push(cityName.toLowerCase());
                localStorage.setItem('favourites', JSON.stringify(storage));
            } else {
                console.log('item already in favorites')
            }

        } else {//No favourites in local storage, so add new
            var favArray = [];
            favArray.push(cityName.toLowerCase());
            localStorage.setItem("favourites", JSON.stringify(favArray));
            console.log('New favourites list');
        }
        displayFavouritesList();
    }

    function removeFavourites(cityName) {
        var favArr = new Array();
        favArr = JSON.parse(localStorage.getItem("favourites"));
        cityName = cityName.toLowerCase();
        favArr.splice(favArr.indexOf(cityName), 1);
        localStorage.setItem('favourites', JSON.stringify(favArr));
        setFavBtnState(cityName);
        displayFavouritesList();
    }

    function displayFavouritesList() {
        var favArr = new Array();
        favArr = JSON.parse(localStorage.getItem("favourites"));
        $(domElements.FavCityListContainer).html("");
        if (favArr) {
            for (var i = 0; i < favArr.length; i++) {
                const cityClass = favArr[i].replace(" ","") + "-container";
                $(domElements.FavCityListContainer).append("<div class='" + cityClass +
                    " fav-city-wrapper'><div class='fav-city-name-wrapper'><span class='fav-city-name'></span></div> \
                   <div class='btn-container'><button class='view-details' title='View more details'> \
                    <span><i class='fa-solid fa-eye'></i></span></button><button class='remove-fav-city' title='Remove from fav'> \
                    <span><i class='fa-solid fa-trash-can'></i></span></button></div></div>");
               $("." + cityClass).find(".fav-city-name").append(favArr[i].toUpperCase());
                
            }
            $(domElements.FavCityListContainer).prepend("<div class='fav-title-container'>Your Favourite Cities</div>");
            $(domElements.ViewDetails).on("click", (e) => {
                getCurrentWeatherData($(e.currentTarget).parent().siblings().find(domElements.FavCityName).text());
            })
            $(domElements.RemoveFavCity).on("click", (e) => {
                removeFavourites($(e.currentTarget).parent().siblings().find(domElements.FavCityName).text());
            })
            $(domElements.FavCityListContainer).removeClass("hide");
        } 
        
    }

    $(domElements.SubmitFavBtn).on("click", (e) => {
        handleFavClick(e);
    })
});
