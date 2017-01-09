/* eslint-disable no-constant-condition */
import Connection from 'worona-asteroid';
import { delay } from 'redux-saga';
import { fork, call, race, take, put } from 'redux-saga/effects';
import * as actions from '../actions';

function* connect(connection) {
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

export default function* previewSettingsSagas() {
  const connection = new Connection({ endpoint: 'wss://meteor.worona.io/websocket' });
  yield [
    fork(connect, connection),
  ];
}
