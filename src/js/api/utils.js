import RequestWatcher from './request-watcher';

let _headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

export function headers (file = false) {
    if (file) {
        return { Auth: _headers.Auth };
    }
    return _headers;
}

export function parseJSON (response) {
    if (response.ok || response.status === 400) {
        return response.json();
    }
    return Promise.reject(response);
}

export function updateHeaders (newHeaders) {
    _headers = { ..._headers, ...newHeaders };
    Object.keys(_headers).forEach((key) => {
        if (undefined === _headers[key]) {
            delete _headers[key];
        }
    });
}

export const requestWatcher = new RequestWatcher();
