import { httpGet, httpDelete, httpPost, httpPut, parseJSONAndRethrow } from '../../utils';

export const LOAD = 'sonora/songs/LOAD';
export const REMOVE = 'sonora/songs/REMOVE';
export const SAVE = 'sonora/songs/SAVE';
export const UPDATE = 'sonora/songs/UPDATE';

export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case LOAD:
      return action.songs;
    case SAVE:
      return [
        ...state,
        action.song
      ]
    case REMOVE:
      return state.filter((song) => song.id != action.songId)
    case UPDATE:
      return state.map((song) => {
        if(song.id === action.song.id){
          return action.song;
        } else {
          return song;
        }
      })
    default:
      return state;
  }
}

export function load(){
  return dispatch => {
    return httpGet('api/secured/songs').then(result => {
      dispatch({
        type: LOAD,
        songs: result.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  };
}

export function save(data) {
  return dispatch => {
    return httpPost('api/secured/songs', { 'song': data })
    .then( newSong => {
      dispatch({
        type: SAVE,
        song: newSong.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function remove(id) {
  return dispatch => {
    return httpDelete(`api/secured/songs/${id}`).then( () => {
      dispatch({
        type: REMOVE,
        songId: id
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}

export function update(id, data) {
  return dispatch => {
    return httpPut(`api/secured/songs/${id}`, { 'song': data })
    .then( updated => {
      dispatch({
        type: UPDATE,
        song: updated.data
      })
    }).catch(parseJSONAndRethrow(dispatch))
  }
}
