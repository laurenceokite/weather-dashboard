var storedCities = [];

function getCurrentWeather(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=d9589021f2b67ec4a8c541454e8c7ac7")
    .then(function(response) {
        return response.json()
      })
    .then(function(response) {
        var cityName = response.name;
        var code = parseInt(response.weather[0].id);
        var currentTemp = response.main.temp;
        var currentHumidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        printCurrentWeather(cityName, code, currentTemp, currentHumidity, windSpeed);
        getUv(lat, lon);
    })
    
};

function getUv(lat, lon) {
    fetch ('http://api.openweathermap.org/data/2.5/uvi?appid=d9589021f2b67ec4a8c541454e8c7ac7&lat=' + lat + '&lon=' + lon)
    .then(function(response) {
        return response.json()
    })
    .then(function(response) {
        var uv = response.value;
        printUv(uv);
    })
}

function printUv(uv) {
    var print = $('#uv-index')
    var uvInt = parseInt(uv);
    print[0].innerHTML = uv;
    if (uvInt >= 8) {
        print.removeClass()
        print.addClass('badge badge-pill badge-danger');
    }
    else if (uvInt >= 3) {
        print.removeClass()
        print.addClass('badge badge-pill badge-warning');
    }
    else if (uvInt < 3) {
        print.removeClass()
        print.addClass('badge badge-pill badge-success');
    }
}

function printCurrentWeather(cityName, code, currentTemp, currentHumidity, windSpeed) {
    var title = $('#city-name');
    var icon = $('#current-icon');
    var date = $('#current-date');
    var temp = $('#temperature');
    var humidity = $('#current-humidity');
    var wind = $('#wind-speed');
    title[0].innerHTML = cityName;
    date[0].innerHTML = moment().format('dddd, MMMM Do');
    temp[0].innerHTML = currentTemp + '<span class="font-weight-lighter"> °F</span>';
    humidity[0].innerHTML = currentHumidity + '<span class="font-weight-lighter">%</span>';
    wind[0].innerHTML = windSpeed + '<span class="font-weight-lighter"> mph</span>';
    if (code >= 803) {
        icon.removeClass();
        icon.addClass('ml-2 mb-1 cloud-icon');
    }
    else if (code >= 801) {
        icon.removeClass();
        icon.addClass('ml-2 mb-1 part-cloud-icon');
    }
    else if (code === 800) {
        icon.removeClass();
        icon.addClass('ml-2 mb-1 sun-icon');
    }
    else if (code >= 700) {
        icon.removeClass();
        icon.addClass('ml-2 mb-1 fog-icon');
    }
    else if (code >= 600) {
        icon.removeClass();
        icon.addClass('ml-2 mb-1 snow-icon');
    }
    else if (code === 511) {
        icon.removeClass();
        icon.addClass('ml-2 mb-1 snow-icon');
    }
    else if (code >= 300) {
        icon.removeClass();
        icon.addClass('ml-2 mb-1 rain-icon');
    }
    else if (code >= 200) {
        icon.removeClass();
        icon.addClass('ml-2 mb-1 thunder-icon');
    }
};

function getFiveDay(city) {
    fetch ('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=d9589021f2b67ec4a8c541454e8c7ac7')
    .then(function(response) {
        return response.json()
    })
    .then(function(response) {
        var dayOne = response.list[7];
        var dayTwo = response.list[15];
        var dayThree = response.list[23];
        var dayFour = response.list[31];
        var dayFive = response.list[39];
        var fiveDay = [dayOne, dayTwo, dayThree, dayFour, dayFive]
        printFiveDay(fiveDay);
    })
};

function printFiveDay(fiveDay) {
    for (let index = 0; index < fiveDay.length; index++) {
        var indexInt = index + 1;
        var day = $('#day-' + indexInt);
        var temp = day.find('#temp') ;
        var humidity = day.find('#humidity');
        var icon = day.find('#icon')
        var title = day.find('.card-title');
        var code = parseInt(fiveDay[index].weather[0].id);
        var weekday = moment().add(indexInt, 'days').format('dddd');
        title[0].innerHTML = weekday;
        temp[0].innerHTML = parseInt(fiveDay[index].main.temp) + "°";
        humidity[0].innerHTML = fiveDay[index].main.humidity + "%";
        if (code >= 803) {
            icon.removeClass();
            icon.addClass('cloud-icon');
        }
        else if (code >= 801) {
            icon.removeClass();
            icon.addClass('part-cloud-icon');
        }
        else if (code === 800) {
            icon.addClass('sun-icon');
        }
        else if (code >= 700) {
            icon.addClass('fog-icon');
        }
        else if (code >= 600) {
            icon.addClass('snow-icon');
        }
        else if (code === 511) {
            icon.addClass('snow-icon');
        }
        else if (code >= 300) {
            icon.addClass('rain-icon');
        }
        else if (code >= 200) {
            icon.addClass('thunder-icon');
        }
    }
};

function saveCities(city) {
    storedCities = storedCities || [];
    storedCities.push(city);
    var cityList = JSON.stringify(storedCities);
    localStorage.setItem('citylist', cityList);
};

function searchClickHandler(event) {
    var city = $(this).parent().siblings('#search-bar').val();
    localStorage.setItem('last', city);
    saveCities(city);
    getCurrentWeather(city);
    getFiveDay(city);
    loadList();
};

function loadCity() {
    var city = localStorage.getItem('last');
    if (!city) {
        city = 'madison';
    }
    loadList();
    getCurrentWeather(city);
    getFiveDay(city);
}

function loadList() {
    storedCities = JSON.parse(localStorage.getItem('citylist'));
    var storageList = $('#storage-list');
    storageList[0].innerHTML = '';
    console.log(storageList);
    if (storedCities) {
        var backwards = storedCities.slice().reverse();
        for (let index = 0; index < 5; index++) {
            if (backwards[index]) {
                var buttonEl = document.createElement('a');
                var title = backwards[index].charAt(0).toUpperCase() + backwards[index].slice(1);
                console.log(title);
                buttonEl.innerHTML = title;
                buttonEl.setAttribute('class', 'list-group-item list-group-item-action d-none d-xl-block');
                console.log(buttonEl);
                storageList.append(buttonEl);
            };      
        };
    };   
};

function listClickHandler() {
    var city = $(this)[0].innerHTML;
    getCurrentWeather(city);
    getFiveDay(city);
};


loadCity();
$('#storage-list').on('click', 'a', listClickHandler);
$('#search-area').on('click', 'button', searchClickHandler);