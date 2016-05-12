const TITLE_CHANGED = 'sonora/application/TITLE_CHANGED';
const TOGGLE_LEFT_NAV = 'sonora/application/TOGGLE_LEFT_NAV';
const CLOSE_LEFT_NAV = 'sonora/application/CLOSE_LEFT_NAV';
const CLEAN_MESSAGE = 'sonora/application/CLEAN_MESSAGE';
const SHOW_MESSAGE = 'sonora/application/SHOW_MESSAGE';
const UNEXPECTED_ERROR = 'sonora/application/UNEXPECTED_ERROR';
const BEGIN_GLOBAL_LOAD = 'reduxAsyncConnect/BEGIN_GLOBAL_LOAD';
const END_GLOBAL_LOAD = 'reduxAsyncConnect/END_GLOBAL_LOAD';
const PLAY = 'sonora/application/PLAY';
const STOP = 'sonora/application/STOP';

const enviroment = {
  isMobileDevice: !!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/),
  isMobileScreen: () => window.innerWidth < 980
}

const initialState = {
  title: '',
  leftNavOpen: !enviroment.isMobileScreen(),
  messages: [],
  enviroment: enviroment,
  isLoading: false,
  playerActive: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TITLE_CHANGED:
      document.title = `${action.title} | Sonora`;
      return { ...state, title: action.title };
    case TOGGLE_LEFT_NAV:
      return { ...state, leftNavOpen: !state.leftNavOpen };
    case CLOSE_LEFT_NAV:
      return { ...state, leftNavOpen: false };
    case SHOW_MESSAGE:
    case UNEXPECTED_ERROR:
      return { ...state, messages: [action.msg, ...state.messages]};
    case CLEAN_MESSAGE:
      return { ...state, messages: state.messages.filter(msg => msg.id !== action.id)};
    case BEGIN_GLOBAL_LOAD:
      return { ...state, isLoading: true};
    case END_GLOBAL_LOAD:
      return { ...state, isLoading: false};
    case PLAY:
      return { ...state, playerActive: true};
    case STOP:
      return { ...state, playerActive: false};
    default:
      return state;
  }
}

export function setTitle(title) {
  return {
    type: TITLE_CHANGED,
    title: title
  }
}

export function showMessage(type, msg) {
  let id = new Date().getMilliseconds();
  return {
    type: SHOW_MESSAGE,
    msg: {msg, type, id}
  }
}

export const showInfoMessage = showMessage.bind(null, 'info');
export const showWarningMessage = showMessage.bind(null, 'warning');
export const showSuccessMessage = showMessage.bind(null, 'success');
export const showErrorMessage = showMessage.bind(null, 'danger');

export function cleanMessage(id) {
  return {
    type: CLEAN_MESSAGE,
    id: id
  }
}

export function unexpectedError(error) {
  let msg = error.code + ' - ' + error.info;
  let id = new Date().getMilliseconds();
  let type = 'danger';
  return {
    type: UNEXPECTED_ERROR,
    msg: {msg, type, id}
  }
}

export function toggleLeftNav() {
  return {
    type: TOGGLE_LEFT_NAV
  }
}

export function closeLeftNav() {
  return {
    type: CLOSE_LEFT_NAV
  }
}

export function play() {
  return {
    type: PLAY
  }
}

export function stop() {
  return {
    type: STOP
  }
}
