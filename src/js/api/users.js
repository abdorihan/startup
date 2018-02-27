import { headers, parseJSON } from './utils';
//
export function loadData () {
    return fetch('/api/users', { method: 'GET', headers: headers() }).then(parseJSON);
}
export function getElement (id) {
    return fetch(`/api/users/${id}`, { method: 'GET', headers: headers() }).then(parseJSON);
}
export function editElement (element, id) {
    return fetch(`/api/users/${id}`, { method: 'PUT', body: element, headers: headers(true) }).then(parseJSON);
}
export function deleteElement (id) {
    return fetch(`/api/users/${id}`, { method: 'DELETE', headers: headers() }).then(parseJSON);
}
export function addElement (element) {
    return fetch('/api/users', { method: 'POST', body: element, headers: headers(true) }).then(parseJSON);
}
