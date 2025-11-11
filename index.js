const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const handlebars = require('express-handlebars');
const path = require('path');

app.engine('handlebars', handlebars.engine({
    helpers: require('./helpers/handlebars.js'),
    partialsDir: path.join(__dirname, 'views/partials')
}));

app.set('view engine', 'handlebars');
app.set('views', './views');
app.set('trust proxy', true);
app.use(express.static('public'));

require('dotenv').config();

app.get('/', (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const location = req.query.location;

    if (lat && lon) {
        getLocationByCoords(lat, lon).then((data) => {
            const city = data.properties.city;
            const timezone = data.properties.timezone;
            const countryCode = data.properties.country_code;

            getWeather(lat, lon, timezone).then((data) => {
                const groupedDates = groupTimeseries(data, timezone);
                
                res.render('home', {
                    dates: groupedDates,
                    last_update: new Date(data.data.properties.meta.updated_at),
                    city: city,
                    lat: lat,
                    lon: lon,
                    countryCode: countryCode,
                    timezone: timezone
                });
            });
        });

        return;
    } else if(location) {
        getCoordsByLocation(location).then((data) => {
            const lon = data.properties.lon;
            const lat = data.properties.lat;
            const timezone = data.properties.timezone;
            const city = data.properties.city;
            const countryCode = data.properties.country_code;

            getWeather(lat, lon).then((data) => {
                res.render('home', {
                    dates: groupTimeseries(data, timezone),
                    last_update: new Date(data.data.properties.meta.updated_at),
                    city: city,
                    lat: lat,
                    lon: lon,
                    countryCode: countryCode,
                    timezone: timezone
                });
            });
        });

        return;
    }


    res.render('home', {
        ip: null,
        dates: [],
        last_update: null,
        city: null,
        lat: null,
        lon: null
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const getLocationByCoords = async(latitude, longitude) => {
    const key = process.env.GEOAPIFY_API_KEY;
    
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.geoapify.com/v1/geocode/reverse/?apiKey='+key+'&lat='+latitude+'&lon='+longitude,
        headers: { }
      };
      
    const response = await axios.request(config);

    return response.data.features[0];
}

const getCoordsByLocation = async(location) => {
    const key = process.env.GEOAPIFY_API_KEY;
    
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.geoapify.com/v1/geocode/search?text='+location+'&apiKey='+key,
        headers: { }
      };
      
    const response = await axios.request(config);

    return response.data.features[0];
}


const getWeather = async(latitude, longitude) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        headers: {
           'User-Agent': 'firefox/5.0',
        },
    };

    const response = await axios.get('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat='+latitude+'&lon='+longitude, config);
    
    return response;
}

const groupTimeseries = (response, timezone) => {
    const grouped = response.data.properties.timeseries.reduce((acc, curr) => {
        
        const keys = Object.keys(acc).length;

        if (keys > 6) {
            return acc;
        }
        
        currentDateTime = new Date(curr.time);
        const key = currentDateTime.toLocaleDateString('en-US', {
            timeZone: timezone.name,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour12: false
        });

        const time = currentDateTime.toLocaleTimeString('en-US', {
            timeZone: timezone.name,
            hour: '2-digit', 
            hour12: false
        });
        
        if (!acc[key]) {
            delete acc['time'];
            delete acc['data'];
            acc[key] = [];
        }

        curr.time = time;
        acc[key].push(curr);

        return acc;     
    });

    return grouped;
}

