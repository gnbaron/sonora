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

export function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}
