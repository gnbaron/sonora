import songs from '../../data/songs.json';

export const LOAD = 'sonora/songs/LOAD';

export const initialState = {
  data: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      state.data = action.songs;
      return state;
    default:
      return state;
  }
}

export function load(){
  return dispatch => {
    dispatch({
      type: LOAD,
      songs: songs
    });
  };
}
