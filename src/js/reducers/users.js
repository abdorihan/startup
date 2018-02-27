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
} from '../actions/users/types';
import { ACCESS_DENIED } from '../actions/index';

import { createReducer } from './utils';

const initialState = {
    data: [],
    element: {}
};

const handlers = {
    [LOAD_USERS_SUCCESS]: (state, action) => ({ data: action.payload.data, loading: false, added: false, error: undefined }),
    [LOAD_USERS_FAIL]: (state, action) => ({ error: { message: action.payload.message } }),
    [LOAD_USER_SUCCESS]: (state, action) => ({ element: action.payload.element, updated: false, deleted: false, error: undefined, loading: false }),
    [LOAD_USER_FAIL]: (state, action) => ({ error: { code: action.payload.statusCode, message: action.payload.message } }),
    [EDIT_USER_SUCCESS]: (state, action) => ({ updated: true, element: action.payload.element, idColumn: action.payload.idColumn }),
    [EDIT_USER_FAIL]: (state, action) => ({ error: { message: action.payload.message } }),
    [DELETE_USER_SUCCESS]: (state, action) => ({ deleted: true, idColumn: action.payload.idColumn }),
    [DELETE_USER_FAIL]: (state, action) => ({ error: { message: action.payload.message } }),
    [ADD_USER_SUCCESS]: (state, action) => ({ added: true, element: action.payload.element }),
    [ADD_USER_FAIL]: (state, action) => ({ error: { message: action.payload.message } }),
    [ACCESS_DENIED]: () => ({ error: { message: 'Access Denied' } })
};

export default createReducer(initialState, handlers);
