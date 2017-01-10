/* eslint-disable no-constant-condition, no-unused-vars */
import Connection from 'worona-asteroid';
import { delay, takeEvery } from 'redux-saga';
import { fork, call, race, take, put, select } from 'redux-saga/effects';
import * as actions from '../actions';
import * as types from '../types';
import * as deps from '../deps';
import * as sagaCreators from '../sagaCreators';

export function* connect(connection) {
  yield call([connection, connection.start]);
  yield put(actions.connectionStarted());
  const connectedChannel = yield call([connection, connection.connectedEventChannel]);
  const disconnectedChannel = yield call([connection, connection.disconnectedEventChannel]);
  while (true) {
    yield put(actions.connectionRequested());
    yield call([connection, connection.connect]);
    const { connected } = yield race({
      connected: take(connectedChannel),
      timeout: call(delay, 3000),
    });
    if (connected) {
      yield put(actions.connectionSucceed());
      yield take(disconnectedChannel);
      yield put(actions.disconnected({ error: 'CONNECTION_LOST' }));
    } else {
      yield put(actions.connectionFailed({ error: 'CONNECTION_TIMEOUT' }));
    }
  }
}

export function* settingsUpdated({ id, event, fields: { woronaInfo, ...fields } }) {
  let newFields = fields;
  if (event === 'changed') {
    const settings = yield select(deps.selectorCreators.getSettingsById(id));
    newFields = { ...settings, ...fields };
  }
  yield put(deps.actions.settingsUpdated({
    _id: id,
    fields: newFields,
  }));
}

export default function* previewSettingsSagas() {
  const connection = new Connection({ endpoint: 'wss://meteor.worona.io/websocket' });
  const siteId = yield select(deps.selectors.getSiteId);
  yield [
    fork(connect, connection),
    fork(sagaCreators.collectionCreator({ collection: 'settings-live', connection })),
    fork(sagaCreators.subscriptionCreator(
      { connection, subscription: 'app-settings-live', params: [{ siteId }] })),
    takeEvery(({ type, collection }) =>
      type === types.COLLECTION_MODIFIED && collection === 'settings-live',
      settingsUpdated),
  ];
}
