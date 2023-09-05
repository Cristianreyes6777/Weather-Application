

const APIKey = "50f758dfa696c286131b4730d3f8efba";
let city = document.getElementById('search-bar').value; 

function buildQueryURL(city) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;
}



function fetchForecastData(queryURL) {
    fetch(queryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log("List length:", data.list.length);

            // Clear existing content in right-panel
            document.querySelector('.right-panel').innerHTML = '';

            for(let i = 4; i < data.list.length; i += 8) { 
                let dailyData = data.list[i];
                

                // Create a card for the weather data
                let card = document.createElement('div');
                card.className = 'weather-card';

                // Populate the card with weather data
                let cityName = document.createElement('h2');
                cityName.textContent = data.city.name;
                card.appendChild(cityName);

                
                let fullDateTime = dailyData.dt_txt;
                let [year, month, day] = fullDateTime.split(' ')[0].split('-');
                let formattedDate = `${month}/${day}/${year}`;
                let date = document.createElement('p');
                date.textContent = formattedDate;
                card.appendChild(date);


                let temperature = document.createElement('p');
                temperature.textContent = `Temperature: ${dailyData.main.temp}°F`;  
                card.appendChild(temperature);

                let windSpeed = dailyData.wind.speed;
                let windSpeedElement = document.createElement('p');
                windSpeedElement.textContent = `Wind Speed: ${windSpeed} MPH`;
                card.appendChild(windSpeedElement);

                let humidity = dailyData.main.humidity;
                let humidityElement = document.createElement('p');
                humidityElement.textContent = `Humidity: ${humidity}%`;
                card.appendChild(humidityElement);

                let description = document.createElement('p');
                description.textContent = `Description: ${dailyData.weather[0].description}`;  
                card.appendChild(description);

                function getWeatherClass(description) {
                    description = description.toLowerCase();

                    if (description.includes('clouds')) {
                        return 'cloudy';
                    } else if (description.includes('rain')) {
                        return 'rainy';
                    } else if (description.includes('clear sky')) {
                        return 'clear-sky';
                    } else {
                        return 'default'; // Default class
                    }
                }

                let weatherClass = getWeatherClass(dailyData.weather[0].description);
                card.classList.add(weatherClass);
                

                // Append the card to the right-panel
                document.querySelector('.right-panel').appendChild(card);

                
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
}



function storeCityInLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

function displayCityInPreviousSearches(city) {
    let div = document.createElement('div');
    let cityName = document.createElement('span');
    cityName.textContent = city;
    div.appendChild(cityName);

    let closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.className = 'close-btn';
    closeButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent city click event
        removeCityFromPreviousSearches(city, div);
    });
    div.appendChild(closeButton);

    div.addEventListener('click', function() {
        let queryURL = buildQueryURL(city);
        fetchForecastData(queryURL);
    });
    
    document.querySelector('.previous-searches').appendChild(div);
}

// Search button click event listener
document.getElementById('search-btn').addEventListener('click', function() {
    let city = document.getElementById('search-bar').value;
    if (city) {
        let queryURL = buildQueryURL(city);
        
        // Fetch weather data and display it
        fetchForecastData(queryURL);
        
        // Store the city in local storage
        storeCityInLocalStorage(city);
        
        // Display the city in the previous searches section
        displayCityInPreviousSearches(city);
    }
});

// Search bar "Enter" key event listener
document.getElementById('search-bar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        let city = document.getElementById('search-bar').value;
        if (city) {
            let queryURL = buildQueryURL(city);
            
            // Fetch weather data and display it
            fetchForecastData(queryURL);
            
            // Store the city in local storage
            storeCityInLocalStorage(city);
            
            // Display the city in the previous searches section
            displayCityInPreviousSearches(city);
        }
    }
});

function removeCityFromPreviousSearches(city, divElement) {
    // Remove the city from local storage
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    const index = cities.indexOf(city);
    if (index > -1) {
        cities.splice(index, 1);
        localStorage.setItem('cities', JSON.stringify(cities));
    }

    // Remove the city element from the DOM
    divElement.remove();
}

// On page load, display the cities stored in local storage
(function displayStoredCities() {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.forEach(city => {
        displayCityInPreviousSearches(city);
    });
})();


