import { dep } from 'worona-deps';

export const actions = {
  get settingsUpdated() { return dep('settings', 'actions', 'settingsUpdated'); },
};

export const selectors = {
  get getSiteId() { return dep('router', 'selectors', 'getSiteId'); },
};

export const selectorCreators = {
  get getSettingsById() { return dep('settings', 'selectorCreators', 'getSettingsById'); },
};
