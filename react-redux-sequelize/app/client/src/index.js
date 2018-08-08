import React from 'react';
import { render } from 'react-dom';
import './index.css';
import Root from './components/Root';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import store from './store';

render(
    <Root store={store} />,
    document.getElementById('root')
  )
registerServiceWorker();
