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
        return value.getHours();
    },
    getDate: function (value) {
        return value.getDate();
    },
    getDay: function (value) {
        return value.getDay();
    },
    getMonth: function (value) {
        return value.getMonth() + 1;
    },
    getMinutes: function (value) {
        return value.getMinutes();
    },
    consoleLog: function (value) {
        console.log(value);
    },
    formatFloat: function (value) {
        return parseFloat(value).toFixed(2);
    }
}