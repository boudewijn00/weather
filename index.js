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

    if (lat && lon) {
        getWeather(lat, lon).then((data) => {
            res.render('home', {
                ip: null,
                dates: groupTimeseries(data),
                last_update: new Date(data.data.properties.meta.updated_at),
                city: null
            });
        });

        return;
    } else if(ip) {
        getLocation(ip).then((data) => {
            const city = data.city;
            getWeather(data.latitude, data.longitude).then((data) => {
                res.render('home', {
                    ip: ip,
                    dates: groupTimeseries(data),
                    last_update: new Date(data.data.properties.meta.updated_at),
                    city: city
                });
            });
        });

        return;
    }

    res.render('home', {
        ip: null,
        dates: [],
        last_update: null,
        city: null
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const getLocation = async(ip) => {
    const key = 'e0f69c584aa94229b513cbfcb4fd892c'
    
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://ipgeolocation.abstractapi.com/v1?api_key='+key+'&ip_address=82.169.46.119',
        headers: { }
      };
      
    const response = await axios.request(config);

    return response.data;
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

