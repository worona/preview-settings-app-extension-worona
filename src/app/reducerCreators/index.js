import * as types from '../types';

export const isReadyCreator = subscription => (state = false, action) => {
  if (action.subscription === subscription) {
    switch (action.type) {
      case types.SUBSCRIPTION_READY:
        return true;
      case types.SUBSCRIPTION_STOPPED:
        return false;
      default:
        return state;
    }
  }
  return state;
};
