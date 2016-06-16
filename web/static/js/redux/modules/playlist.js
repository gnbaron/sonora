export const ADD = 'sonora/playlist/ADD';
export const REMOVE = 'sonora/playlist/REMOVE';

export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case ADD:
      return [
        ...state,
        action.song
      ]
    case REMOVE:
      return state.filter((song) => song.id != action.song.id)
    default:
      return state;
  }
}

export function addSong(song){
  return dispatch => {
    dispatch({
      type: ADD,
      song: song
    })
  };
}

export function removeSong(song){
  return dispatch => {
    dispatch({
      type: REMOVE,
      song: song
    })
  };
}
