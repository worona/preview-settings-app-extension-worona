import { fork } from 'redux-saga/effects';

function* logSaga() {
  console.log('Preview settings running!');
}

export default function* testSagas() {
  yield [
    fork(logSaga),
  ];
}
