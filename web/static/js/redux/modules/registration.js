import { httpPost, parseJSONAndRethrow } from '../../utils';
import * as session from './session';

export function signUp(data) {
  return dispatch => {
    return httpPost('/api/registration', data)
    .then((auth) => {
      dispatch(session.userLoggedIn(auth));
    })
    .catch(parseJSONAndRethrow(dispatch));
  };
}
