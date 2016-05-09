import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { reducer as reduxAsyncConnect } from 'redux-async-connect'
import session from './session';
import application from './application';

export default combineReducers({
  reduxAsyncConnect,
  routing: routerReducer,
  form,
  session,
  application
});
