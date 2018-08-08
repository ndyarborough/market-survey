import React, { Component } from 'react';
// import { connect } from 'react-redux';

import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Register from './pages/Register';
import NoMatch from './components/NoMatch';

// @connect((store) => {
//     return {
//         user: store.user
//     }
// })


export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
            <Switch>  
                <Route exact path='/' component={Home} />
                <Route path='/register' component={Register} />
                <Route component={NoMatch} />
            </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
