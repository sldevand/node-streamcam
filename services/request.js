const fetch = require("node-fetch");

const request = {
    fetchJson: (endpoint) => {
        return fetch(endpoint).then((response) => {
            return response.json();
        });
    },
    forwardJson: (endpoint, res) => {
        return request.fetchJson(endpoint)
            .then((json) => {
                return res.send({ success: json });
            })
            .catch((err) => {
                return res.send({ error: err });
            });
    }
}

module.exports = request;