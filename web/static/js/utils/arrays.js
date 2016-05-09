import Immutable from 'immutable';

export function toImmutableList(data) {
  if (!data) {
    return new Immutable.List();
  } else if (Array.isArray(data)) {
    return Immutable.List.of(...data);
  } else {
    return data;
  }
}
