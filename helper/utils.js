const utils = {
    findUrl: (extraUrls, type) => {
        if (extraUrls.hasOwnProperty(type)) {
            return extraUrls[type];
        }

        return null;
    },
    actionsAreAuthorized: (action, actions) => {
        return actions.includes(action);
    },
    compareNow: (time) => {
        let now = new Date();
        let nowMinutes = now.getHours() * 60 + now.getMinutes();
        let parseTime = time.split(':');
        let minutes = parseInt(parseTime[0]) * 60 + parseInt(parseTime[1]);

        return nowMinutes - minutes;
    }
};

module.exports = utils;