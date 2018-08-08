import {createStore, applyMiddleware, compose } from 'redux';
// Middleware
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
// Reducers
import rootReducer from './reducers';

const middleware = applyMiddleware(promise(), thunk, createLogger());


// Takes in the rootReducer and any middleware
const store = createStore(
    rootReducer,
    compose(middleware)
);

export default store;