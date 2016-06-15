import { httpGet, httpDelete, httpPost, httpPut, parseJSONAndRethrow } from '../../utils';

export const LOAD = 'sonora/genres/LOAD';
export const REMOVE = 'sonora/genres/REMOVE';
export const SAVE = 'sonora/genres/SAVE';
export const UPDATE = 'sonora/genres/UPDATE';

export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case LOAD:
      return action.genres;
    case SAVE:
      return [
        ...state,
        action.genre
      ]
    case REMOVE:
      return state.filter((genre) => genre.id != action.genreId)
    case UPDATE:
      return state.map((genre) => {
        if(genre.id == action.genre.id){
          return genre;
        } else {
          return action.genre;
        }
      })
    default:
      return state;
  }
}

export function load(){
  return dispatch => {
    return httpGet('api/secured/genres').then(result => {
      dispatch({
        type: LOAD,
        genres: result.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  };
}

export function save(data) {
  return dispatch => {
    return httpPost('api/secured/genres', { 'genre': data })
    .then( newGenre => {
      dispatch({
        type: SAVE,
        genre: newGenre
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function remove(id) {
  return dispatch => {
    return httpDelete(`api/secured/genres/${id}`).then( () => {
      dispatch({
        type: REMOVE,
        genreId: id
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function update(id, data) {
  return dispatch => {
    return httpPut(`api/secured/genres/${id}`, data)
    .then( updated => {
      dispatch({
        type: UPDATE,
        genre: updated
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}
