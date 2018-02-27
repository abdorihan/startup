import { loadData, getElement, editElement, deleteElement, addElement } from '../../api/users';
import {
    LOAD_USERS_SUCCESS,
    LOAD_USERS_FAIL,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    ADD_USER_SUCCESS,
    ADD_USER_FAIL
} from './types';
import { ACCESS_DENIED } from '../index';

export function loadUsers () {
    return (dispatch, getState) => {
        if (getState().session.prevs.indexOf('load_emp') === -1) {
            dispatch({ type: ACCESS_DENIED });
            return;
        }
        loadData().then((payload) => {
            if (payload.data) {
                dispatch({ type: LOAD_USERS_SUCCESS, payload });
            } else {
                dispatch({
                    type: LOAD_USERS_FAIL,
                    payload: {
                        statusCode: payload.status, message: payload.statusText
                    }
                });
            }
        }).catch(payload => (
            dispatch({
                type: LOAD_USER_FAIL,
                payload: {
                    statusCode: payload.status, message: payload.statusText
                }
            })
        ));
    };
}

export function getUser (id) {
    return (dispatch, getState) => {
        if (getState().session.prevs.indexOf('load_emp') === -1) {
            dispatch({ type: ACCESS_DENIED });
            return;
        }
        getElement(id).then((payload) => {
            if (payload.element) {
                dispatch({ type: LOAD_USER_SUCCESS, payload });
            } else {
                dispatch({
                    type: LOAD_USER_FAIL,
                    payload: {
                        statusCode: payload.status, message: payload.statusText
                    }
                });
            }
        }).catch(payload => {
            dispatch({
                type: LOAD_USER_FAIL,
                payload: {
                    statusCode: payload.status, message: payload.statusText
                }
            });
        });
    };
}

export function editUser (element, id) {
    return (dispatch, getState) => {
        if (getState().session.prevs.indexOf('edit_emp') === -1) {
            dispatch({ type: ACCESS_DENIED });
            return;
        }
        const data = new FormData(); // eslint-disable-line
        const keys = Object.keys(element);
        for (let i = 0; i < keys.length; i++) {
            data.append(keys[i], element[keys[i]]);
        }
        editElement(data, id).then((payload) => {
            if (payload.ok) {
                payload.element = element;
                dispatch({ type: EDIT_USER_SUCCESS, payload });
            } else {
                dispatch({
                    type: EDIT_USER_FAIL,
                    payload: {
                        statusCode: payload.status, message: payload.msg
                    }
                });
            }
        }).catch(payload => {
            dispatch({
                type: EDIT_USER_FAIL,
                payload: {
                    statusCode: payload.status, message: payload.msg
                }
            });
        });
    };
}

export function deleteUser (id) {
    return (dispatch, getState) => {
        if (getState().session.prevs.indexOf('delete_emp') === -1) {
            dispatch({ type: ACCESS_DENIED });
            return;
        }
        deleteElement(id).then((payload) => {
            if (payload.ok) {
                dispatch({ type: DELETE_USER_SUCCESS, payload });
            } else {
                dispatch({
                    type: DELETE_USER_FAIL,
                    payload: {
                        statusCode: payload.status, message: payload.statusText
                    }
                });
            }
        }).catch(payload => (
            dispatch({
                type: DELETE_USER_FAIL,
                payload: {
                    statusCode: payload.status, message: payload.statusText
                }
            })
        ));
    };
}

export function addNewUser (element) {
    return (dispatch, getState) => {
        if (getState().session.prevs.indexOf('add_emp') === -1) {
            dispatch({ type: ACCESS_DENIED });
            return;
        }
        const data = new FormData(); // eslint-disable-line
        const keys = Object.keys(element);
        for (let i = 0; i < keys.length; i++) {
            data.append(keys[i], element[keys[i]]);
        }
        addElement(data).then((payload) => {
            if (payload.ok) {
                dispatch({ type: ADD_USER_SUCCESS, payload });
            } else {
                dispatch({
                    type: ADD_USER_FAIL,
                    payload: {
                        statusCode: payload.status, message: payload.msg
                    }
                });
            }
        }).catch(payload => (
            dispatch({
                type: ADD_USER_FAIL,
                payload: {
                    statusCode: payload.status, message: payload.statusText
                }
            })
        ));
    };
}
