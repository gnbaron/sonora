import artists from '../../data/artists.json';

export const LOAD = 'sonora/artists/LOAD';

export const initialState = {
  data: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      state.data = action.artists;
      return state;
    default:
      return state;
  }
}

export function load(){
  return dispatch => {
    dispatch({
      type: LOAD,
      artists: artists
    });
  };
}
