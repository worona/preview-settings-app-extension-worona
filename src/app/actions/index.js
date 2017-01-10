import * as types from '../types';

export const connectionStarted = () => ({ type: types.CONNECTION_STARTED });
export const connectionRequested = () => ({ type: types.CONNECTION_REQUESTED });
export const connectionSucceed = () => ({ type: types.CONNECTION_SUCCEED });
export const connectionFailed = ({ error }) => ({ type: types.CONNECTION_FAILED, error });
export const disconnected = ({ error }) => ({ type: types.DISCONNECTED, error });

export const collectionModified = ({ collection, event, id, fields }) =>
  ({ type: types.COLLECTION_MODIFIED, collection, event, id, fields });
export const subscriptionStarted = ({ subscription, params }) =>
  ({ type: types.SUBSCRIPTION_STARTED, subscription, params });
export const subscriptionReady = ({ subscription }) =>
  ({ type: types.SUBSCRIPTION_READY, subscription });
export const subscriptionFailed = ({ subscription, error }) =>
  ({ type: types.SUBSCRIPTION_FAILED, subscription, error });
export const subscriptionStopped = ({ subscription }) =>
  ({ type: types.SUBSCRIPTION_STOPPED, subscription });
