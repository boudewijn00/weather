module.exports = {
    isNotEmpty: function (value) {
        return value !== undefined && value !== null && value !== "";
    },
    isEmpty: function (value) {
        return value === undefined || value === null || value === "";
    },
    isDifferentDate: function (root, index) {
        if(index === 0) {
            return true;
        }

        const previous = root.timeseries[index - 1];
        const current = root.timeseries[index];


        if(previous.time.getDate() !== current.time.getDate()) {
            return true;
        }

        return false;
    },
    getHours: function (value) {
        return new Date().getHours();
    },
    getDate: function (value) {
        return new Date().getDate();
    },
    getDay: function (value) {
        return new Date(value).getDay();
    },
    getMonth: function (value) {
        return new Date(value).getMonth() + 1;
    },
    getMinutes: function (value) {
        const date = new Date();
        const minutes = date.getMinutes();
        return minutes < 10 ? '0' + minutes : minutes;
    },
    getDayName: function(value) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = new Date().getDay();
        return days[dayIndex];
    },
    getMonthName: function(value) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = new Date().getMonth();
        return months[monthIndex];
    },
    consoleLog: function (value) {
        console.log(value);
    },
    formatFloat: function (value) {
        return parseFloat(value).toFixed(2);
    },
    toKmh: function (value) {
        const kmh = parseFloat(value) * 3.6;
        return kmh.toFixed(1);
    },
    isLessThan: function (value, limit) {
        return value < limit;
    },
    isGte: function (value, limit) {
        return value >= limit;
    },
    hasHoursToShow: function(hours, dayIndex) {
        if (!hours || !Array.isArray(hours) || hours.length === 0) {
            return false;
        }

        if (dayIndex === 0) {
            return hours.length > 1;
        }
        
        return true;
    },
    getFirstHour: function (dates) {
        if (!dates || typeof dates !== 'object' || Object.keys(dates).length === 0) {
            return null;
        }
        const firstDayKey = Object.keys(dates)[0];
        if (dates[firstDayKey] && dates[firstDayKey].length > 0) {
            return dates[firstDayKey][0];
        }
        return null;
    },
    isNotFirstHourOfFirstDay: function (dayIndex, hourIndex) {
        return dayIndex !== 0 || hourIndex !== 0;
    }
}
