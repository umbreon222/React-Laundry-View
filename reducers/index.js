import { combineReducers } from 'redux';
import settingsReducer from './settings_reducer';
import machinesReducer from './machines_reducer';

export default combineReducers({
  settingsReducer,
  machinesReducer,
});
