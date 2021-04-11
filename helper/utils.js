const utils = {
    findUrl: function (extraUrls, type) {
        if (extraUrls.hasOwnProperty(type)) {
            return extraUrls[type];
        }

        return null;
    }
};

module.exports = utils;