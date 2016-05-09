import { createStore as _createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import reducers from './modules/reducer';

export default function createStore(history) {
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  const reduxRouterMiddleware = routerMiddleware(history);

  const createStoreWithMiddleware = applyMiddleware(thunk, logger, reduxRouterMiddleware)(_createStore);
  const store = createStoreWithMiddleware(reducers, window.devToolsExtension ? window.devToolsExtension() : f => f);

  const syncedHistory = syncHistoryWithStore(history, store);

  return {syncedHistory, store};
}
