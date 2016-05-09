import { httpPost, httpGet, httpDelete, parseJSONAndRethrow, TokenManager } from '../../utils';
import { push } from 'react-router-redux'

const LOGGED_IN = 'ddp/session/LOGGED_IN';
const LOGGED_OUT = 'ddp/session/LOGGED_OUT';

const initialState = {
  currentUser: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGGED_IN:
      return { ...state, currentUser: action.user, error: null };
    case LOGGED_OUT:
      return { ...state, currentUser: null};
    default:
      return state;
  }
}

export function userLoggedIn({jwt, user}) {
  return dispatch => {
    TokenManager.save(jwt);
    dispatch({
      type: LOGGED_IN,
      user: user
    });
    dispatch(push('/'));
  }
}

export function signIn(email, password) {
  return dispatch => {
    return httpPost('api/session', {email: email, password: password})
    .then(auth => dispatch(userLoggedIn(auth)))
    .catch(parseJSONAndRethrow(dispatch))
  }
}

export function signOut() {
  return dispatch => {
    return httpDelete('api/session')
    .then(() => {
      TokenManager.delete();
      dispatch({
        type: LOGGED_OUT
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function updateProfile(id, user) {
  return dispatch => {
    return httpPost('api/secured/users/'+id, user).then(updatedUser => {
      dispatch({
        type: LOGGED_IN,
        user: updatedUser
      });
    }).catch(parseJSONAndRethrow(dispatch));
  }
}

export function currentUser() {
  return dispatch => {
    return httpGet('/api/session/current_user')
    .then((data) => {
      dispatch({
        type: LOGGED_IN,
        user: data.user
      });
    })
    .catch(() => {
      dispatch(push('/signin'));
    });
  };
}
