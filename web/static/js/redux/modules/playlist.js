import { httpGet, httpDelete, httpPost, httpPut, parseJSONAndRethrow } from '../../utils';

export const LOAD = 'sonora/playlist/LOAD';
export const REMOVE = 'sonora/playlist/REMOVE';
export const SAVE = 'sonora/playlist/SAVE';
export const UPDATE = 'sonora/playlist/UPDATE';

export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case LOAD:
      return action.playlist;
    case SAVE:
      return [
        ...state,
        action.genre
      ]
    case REMOVE:
      return state.filter((genre) => genre.id != action.genreId)
    case UPDATE:
      return state.map((genre) => {
        if(genre.id === action.genre.id){
          return action.genre;
        } else {
          return genre;
        }
      })
    default:
      return state;
  }
}

export function load(){
  return dispatch => {
    return httpGet('api/secured/playlist').then(result => {
      dispatch({
        type: LOAD,
        playlist: result.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  };
}

export function save(data) {
  return dispatch => {
    return httpPost('api/secured/playlist', { 'genre': data })
    .then( newGenre => {
      dispatch({
        type: SAVE,
        genre: newGenre.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function remove(id) {
  return dispatch => {
    return httpDelete(`api/secured/playlist/${id}`).then( () => {
      dispatch({
        type: REMOVE,
        genreId: id
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function update(id, data) {
  return dispatch => {
    return httpPut(`api/secured/playlist/${id}`, { 'genre': data })
    .then( updated => {
      dispatch({
        type: UPDATE,
        genre: updated.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}
