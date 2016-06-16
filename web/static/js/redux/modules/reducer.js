import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { reducer as reduxAsyncConnect } from 'redux-async-connect'
import session from './session';
import application from './application';
import genres from './genres';
import songs from './songs';
import artists from './artists';
import playlist from './playlist';

export default combineReducers({
  reduxAsyncConnect,
  routing: routerReducer,
  form,
  session,
  application,
  genres,
  songs,
  artists,
  playlist
});
