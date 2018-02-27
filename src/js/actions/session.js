import { SESSION_LOAD, SESSION_LOGIN, SESSION_LOGOUT } from '../actions';
import { deleteSession, postSession, updateSession } from '../api/session';
import { updateHeaders } from '../api/utils';

const localStorage = window.localStorage;

export function initialize() {
    return (dispatch) => {
        const { email, name, token, id, prevs } = localStorage;
        if (email && token) {
            updateHeaders({ Auth: token });
            dispatch({
                type: SESSION_LOAD, payload: { email, name, token, id, prevs }
            });
            updateSession()
                .then((payload) => {
                    if (!payload.ok) {
                        updateHeaders({ Auth: undefined });
                        try {
                            localStorage.removeItem('email');
                            localStorage.removeItem('name');
                            localStorage.removeItem('token');
                            localStorage.removeItem('id');
                            localStorage.removeItem('prevs');
                        } catch (e) {
                            // ignore
                        }
                        window.location = '/login';
                    }
                }).catch(() => {
                    updateHeaders({ Auth: undefined });
                    try {
                        localStorage.removeItem('email');
                        localStorage.removeItem('name');
                        localStorage.removeItem('token');
                        localStorage.removeItem('id');
                        localStorage.removeItem('prevs');
                    } catch (e) {
                        // ignore
                    }
                    window.location = '/login';
                });
        } else {
            window.location = '/login';
        }
    };
}

export function login(email, password, done) {
    return dispatch => (
        postSession(email, password)
            .then((payload) => {
                if (payload.element) {
                    updateHeaders({ Auth: payload.element.token });
                    dispatch({ type: SESSION_LOGIN, payload });
                    try {
                        localStorage.email = payload.element.email;
                        localStorage.name = payload.element.name;
                        localStorage.token = payload.element.token;
                        localStorage.id = payload.element.emp_id;
                        localStorage.prevs = payload.element.prevs;
                    } catch (e) {
                        alert(
                            'Unable to preserve session, probably due to being in private ' +
                            'browsing mode.'
                        );
                    }
                    done();
                }
                dispatch({
                    type: SESSION_LOGIN,
                    error: true,
                    payload: {
                        statusCode: payload.status, message: payload.statusText
                    }
                });
            })
            .catch(payload => {
                dispatch({
                    type: SESSION_LOGIN,
                    error: true,
                    payload: {
                        statusCode: payload.status, message: payload.statusText
                    }
                });
            })
    );
}

export function logout(session) {
    return (dispatch) => {
        dispatch({ type: SESSION_LOGOUT });
        deleteSession(session);
        updateHeaders({ Auth: undefined });
        try {
            localStorage.removeItem('email');
            localStorage.removeItem('name');
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('prevs');
        } catch (e) {
            // ignore
        }
        window.location.href = '/login'; // reload fully
    };
}
