import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import {
  feedViewOptionsMiddleware,
  apiMiddleware,
  asyncMiddleware,
  authMiddleware,
  likesLogicMiddleware,
  optimisticLikesMiddleware,
  userPhotoLogicMiddleware,
  groupPictureLogicMiddleware,
  redirectionMiddleware,
  requestsMiddleware,
  markDirectsAsReadMiddleware,
  markNotificationsAsReadMiddleware,
  realtimeMiddleware,
  dataFixMiddleware,
  appearanceMiddleware,
  initialWhoamiMiddleware,
  unscrollMiddleware,
  subscriptionMiddleware,
  onResponseMiddleware,
  betaChannelMiddleware,
} from './middlewares';

import * as reducers from './reducers';
import * as ActionCreators from './action-creators';

//order matters — we need to stop unauthed async fetching before request, see authMiddleware
const middleware = [
  unscrollMiddleware,
  feedViewOptionsMiddleware,
  authMiddleware,
  apiMiddleware,
  asyncMiddleware,
  dataFixMiddleware,
  likesLogicMiddleware,
  optimisticLikesMiddleware,
  userPhotoLogicMiddleware,
  groupPictureLogicMiddleware,
  redirectionMiddleware,
  requestsMiddleware,
  markDirectsAsReadMiddleware,
  markNotificationsAsReadMiddleware,
  realtimeMiddleware,
  appearanceMiddleware,
  initialWhoamiMiddleware,
  subscriptionMiddleware,
  onResponseMiddleware,
  betaChannelMiddleware,
];

const enhancers = [applyMiddleware(...middleware)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const storeEnhancer = composeEnhancers(...enhancers);

const createStoreWithMiddleware = storeEnhancer(createStore);
const reducer = combineReducers({ ...reducers, routing: routerReducer });

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);

  // Initial subscription
  store.dispatch(ActionCreators.realtimeSubscribe('global:users'));

  return store;
}
