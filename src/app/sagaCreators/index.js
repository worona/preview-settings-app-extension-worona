/* eslint-disable no-constant-condition */
import { call, take, put, fork, apply } from 'redux-saga/effects';
import * as actions from '../actions';
import * as types from '../types';

export function* subscriptionEvents(channel, action) {
  while (true) {
    const result = yield take(channel);
    yield put(action(result));
  }
}

const collectionsWatched = [];

export const collectionCreator = ({ connection, collection }) =>
  function* collectionWatcher() {
    if (collectionsWatched.indexOf(collection) === -1) {
      collectionsWatched.push(collection);
      const channel = yield call([connection, connection.collectionEventChannel], collection);
      yield fork(subscriptionEvents, channel, actions.collectionModified);
    }
  };

export const subscriptionCreator = ({ connection, subscription, params = [] }) =>
  function* subscriptionWatcher() {
    while (true) {
      yield take(types.CONNECTION_SUCCEED);
      yield put(actions.subscriptionStarted({ subscription, params }));
      const subs = yield apply(connection, connection.subscribe, [subscription, ...params]);
      const readyChannel = yield call([connection, connection.readyEventChannel], subs);
      const errorChannel = yield call([connection, connection.errorEventChannel], subs);
      const readySaga = yield fork(subscriptionEvents, readyChannel, actions.subscriptionReady);
      const failedSaga = yield fork(subscriptionEvents, errorChannel, actions.subscriptionFailed);
      yield take(types.DISCONNECTED);
      readySaga.cancel();
      failedSaga.cancel();
      yield call([connection, connection.unsubscribe], subs.id);
      yield put(actions.subscriptionStopped({ subscription }));
    }
  };
