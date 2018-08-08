import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from '../../App';
import store from '../../store.js';

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}