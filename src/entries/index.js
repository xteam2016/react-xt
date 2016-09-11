import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers} from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
// import { browserHistory } from 'react-router';
import { useRouterHistory } from 'react-router'
import { createHistory, useBasename } from 'history'
// import { createHistory } from 'history'
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';
import reducers from '../reducers/index';
import SagaManager from '../sagas/SagaManager';
import './index.less';
import 'babel-polyfill'
let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin({
  shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
    return true;
  }
});

//////////////////////
// Store

const sagaMiddleware = createSagaMiddleware();
const initialState =  {};
const enhancer = compose(
  applyMiddleware(sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);
const store = createStore(combineReducers({
  ...reducers, routing,
}), initialState, enhancer);

SagaManager.startSagas(sagaMiddleware);

if (module.hot) {
  module.hot.accept('../reducers', () => {
    const reducers = require('../reducers');
    const combinedReducers = combineReducers({ ...reducers, routing });
    store.replaceReducer(combinedReducers);
  });
  module.hot.accept('../sagas/SagaManager', () => {
    SagaManager.cancelSagas(store);
    require('../sagas/SagaManager').default.startSagas(sagaMiddleware);
  });
}


//////////////////////
// Render
const history = syncHistoryWithStore(useRouterHistory(createHistory)({
  basename: '/'
}),store);


let render = () => {
  const Routes = require('../routes/index');
  ReactDOM.render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>
  , document.getElementById('root'));
};


render();

