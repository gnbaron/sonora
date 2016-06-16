import { httpGet, httpDelete, httpPost, httpPut, parseJSONAndRethrow } from '../../utils';

export const LOAD = 'sonora/artists/LOAD';
export const REMOVE = 'sonora/artists/REMOVE';
export const SAVE = 'sonora/artists/SAVE';
export const UPDATE = 'sonora/artists/UPDATE';

export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case LOAD:
      return action.artists;
    case SAVE:
      return [
        ...state,
        action.artist
      ]
    case REMOVE:
      return state.filter((genre) => genre.id != action.artistId)
    case UPDATE:
      return state.map((artist) => {
        if(artist.id === action.artist.id){
          return action.artist;
        } else {
          return artist;
        }
      })
    default:
      return state;
  }
}

export function load(){
  return dispatch => {
    return httpGet('api/secured/artists').then(result => {
      dispatch({
        type: LOAD,
        artists: result.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  };
}

export function save(data) {
  return dispatch => {
    return httpPost('api/secured/artists', { 'artist': data })
    .then( newArtist => {
      dispatch({
        type: SAVE,
        artist: newArtist.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function remove(id) {
  return dispatch => {
    return httpDelete(`api/secured/artists/${id}`).then( () => {
      dispatch({
        type: REMOVE,
        artistId: id
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function update(id, data) {
  return dispatch => {
    return httpPut(`api/secured/artists/${id}`, { 'artist': data })
    .then( updated => {
      dispatch({
        type: UPDATE,
        artist: updated.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}
