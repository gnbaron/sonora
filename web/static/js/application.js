import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-async-connect'
import routes from './routes';
import createStore from './redux/create';

let {syncedHistory, store} = createStore(browserHistory);

ReactDOM.render(
  <Provider store={store}>
    <Router
      render={(props) => <ReduxAsyncConnect {...props} filter={item => !item.deferred}/>}
      history={syncedHistory}>
        {routes}
    </Router>
  </Provider>,
  document.getElementById('main')
);
