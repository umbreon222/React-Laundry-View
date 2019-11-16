import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'settingsReducer',
  ],
};

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
export const store = createStoreWithMiddleware(persistedReducer);
export const persistor = persistStore(store);
