import fetch from 'isomorphic-fetch';
import { showErrorMessage, unexpectedError } from '../redux/modules/application'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

function buildHeaders() {
  return { ...defaultHeaders, Authorization: TokenManager.get()};
}

function normalizeUrl(url) {
  return sonora.config.baseUrl + url;
}

/**
* Creates a function that tries to trasform the response into a JSON and them
* throws the error object.
*
* If the error is not a JSON, an UNEXPECTED_ERROR event will be fired.
*
* This function is suposed to be used inside a catch block. ie:
* ```javascript
*   return httpPost('/api/registrations', data)
*   .then(() => {
*     dispatch(routeActions.push('/'));
*   })
*   .catch(parseJSONAndRethrow(dispatch));
* ```
*/
export function parseJSONAndRethrow(dispatch) {
  return error => {
    if (!error.response) {
      console.error(error); //eslint-disable-line no-console
      let msg = error.message || error;
      return dispatch(showErrorMessage(msg));
    }
    else {
      return error.response.json().then(jsonerr => {
        if (!jsonerr || !Object.keys(jsonerr)) {
          let msg = error.response.status + ' - ' + error.response.statusText;
          dispatch(showErrorMessage(msg));
        } else {
          throw jsonerr;
        }
      }, () => {
        //TODO: Add more information to the error.
        let errorInfo = {code: error.response.status, info: error.response.statusText};
        dispatch(unexpectedError(errorInfo));
      });
    }
  }
}

export function bindAsyncActionCreator(actionCreator, dispatch) {
  return (...args) => {
    return dispatch(actionCreator(...args));
  };
}

export default function bindAsyncActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindAsyncActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindAsyncActionCreators expected an object or a function');
  }

  var keys = Object.keys(actionCreators)
  var boundActionCreators = {}
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindAsyncActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators;
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export function parseJSON(response) {
  if (response.status !== 204){
    return response.json();
  }
  return {};
}

export function httpGet(url) {
  return fetch(normalizeUrl(url), {
    headers: buildHeaders()
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPut(url, data) {
  const body = JSON.stringify(data);

  return fetch(normalizeUrl(url), {
    method: 'put',
    headers: buildHeaders(),
    body: body
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPost(url, data) {
  const body = JSON.stringify(data);

  return fetch(normalizeUrl(url), {
    method: 'post',
    headers: buildHeaders(),
    body: body
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpDelete(url) {
  return fetch(normalizeUrl(url), {
    method: 'delete',
    headers: buildHeaders()
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function parseJSONError(data) {
  if (data.error) {
    return data.error;
  }
  else {
    return Object.keys(data).map( key => {
      return key + ' - ' + data[key] ;
    });
  }
}

/**
* Manage the token from localStorage
*/
const tokenId = 'sonora.authToken';
export const TokenManager = {
  save: (token) => {
    localStorage.setItem(tokenId, token);
  },
  get: () => {
    return localStorage.getItem(tokenId);
  },
  delete: () => localStorage.removeItem(tokenId)
}
