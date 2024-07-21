const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const handlebars = require('express-handlebars');

app.engine('handlebars', handlebars.engine({
    helpers: require('./helpers/handlebars.js')
}));

app.set('view engine', 'handlebars');
app.set('views', './views');
app.set('trust proxy', true);
app.use(express.static('public'));

require('dotenv').config();

app.get('/', (req, res) => {
    const ip = req.query.ip;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const city = req.query.city;

    if (lat && lon) {
        getLocationByCoords(lat, lon).then((data) => {
            const city = data.name;

            getWeather(lat, lon).then((data) => {
                res.render('home', {
                    dates: groupTimeseries(data),
                    last_update: new Date(data.data.properties.meta.updated_at),
                    city: city,
                    lat: lat,
                    lon: lon
                });
            });
        });

        return;
    } else if(ip) {
        getLocationByIp(ip).then((data) => {
            const city = data.city;
            const lat = data.latitude;
            const lon = data.longitude;
            getWeather(lat, lon).then((data) => {
                res.render('home', {
                    dates: groupTimeseries(data),
                    last_update: new Date(data.data.properties.meta.updated_at),
                    city: city,
                    lat: lat,
                    lon: lon
                });
            });
        });

        return;
    } else if(city) {
        getCoordsByCity(city).then((data) => {
            const lon = data.lon;
            const lat = data.lat;
            getWeather(lat, lon).then((data) => {
                res.render('home', {
                    dates: groupTimeseries(data),
                    last_update: new Date(data.data.properties.meta.updated_at),
                    city: city,
                    lat: lat,
                    lon: lon
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

const getLocationByIp = async(ip) => {
    const key = process.env.ABSTRACT_API_KEY;
    
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://ipgeolocation.abstractapi.com/v1?api_key='+key+'&ip_address='+ip,
        headers: { }
      };
      
    const response = await axios.request(config);

    return response.data;
}

const getLocationByCoords = async(latitude, longitude) => {
    const key = process.env.OPEN_WEATHER_API_KEY;
    
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.openweathermap.org/geo/1.0/reverse?appid='+key+'&lat='+latitude+'&lon='+longitude,
        headers: { }
      };
      
    const response = await axios.request(config);

    return response.data[0];
}

const getCoordsByCity = async(city) => {
    const key = process.env.OPEN_WEATHER_API_KEY;
    
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&appid='+key,
        headers: { }
      };
      
    const response = await axios.request(config);

    return response.data[0];
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

const groupTimeseries = (response) => {
    const grouped = response.data.properties.timeseries.reduce((acc, curr) => {
        
        if(!curr.data.next_1_hours) {
            return acc;
        }

        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        curr.time = new Date(curr.time);
        const month = curr.time.getMonth() + 1;
        const date = curr.time.getDate();
        const key = (days[curr.time.getDay()] + ' ' + date + '/' + month);
        
        if (!acc[key]) {
            delete acc['time'];
            delete acc['data'];
            acc[key] = [];
        }

        acc[key].push(curr);

        return acc;     
    });

    return grouped;
}

