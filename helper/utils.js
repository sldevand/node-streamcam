const utils = {
    findUrl: (extraUrls, type) => {
        if (extraUrls.hasOwnProperty(type)) {
            return extraUrls[type];
        }

        return null;
    },
    actionsAreAuthorized: (action, actions) => {
        return actions.includes(action);
    }
};

module.exports = utils;