export default class Network {
    fetchJson(endpoint) {
        return fetch(endpoint).then((response) => {
            return response.json();
        });
    }
    
    fetchText(endpoint, errorMessage) {
        return this.fetchJson(endpoint).then((json) => {
            if (errorMessage) {
                json.error = errorMessage;
            }
            return json.success ? json.success : json.error;
        });
    }
}