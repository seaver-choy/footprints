import {applyMiddleware, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import {createLogger} from 'redux-logger';
import rootReducer from './reducers';
import {watchAuth} from './sagas';

import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';

let logger = createLogger({
  timestamps: false,
  duration: false,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1, // see "Merge Process" section for details.
  whitelist: ['auth', 'geofence'],
  debug: false,
};

const sagaMiddleware = createSagaMiddleware();

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  pReducer,
  applyMiddleware(thunk, sagaMiddleware),
);
export const persistor = persistStore(store);

// sagaMiddleware.run(watchAuth)
