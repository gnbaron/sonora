import Immutable from 'immutable';
import genres from '../../data/genres.json';

export const LOAD = 'sonora/genres/LOAD';

export const initialState = Immutable.fromJS({
  data: new Immutable.Map()
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return state.set('data', Immutable.fromJS(action.genres));
    default:
      return state;
  }
}

export function load(){
  return dispatch => {
    dispatch({
      type: LOAD,
      genres: genres
    });
  };
}
