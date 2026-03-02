import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createMigrate, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import commonReducer from "./commonReducers";
import {rawPersistedReducer} from "./persistReducer";

const migrationConfig = {
  0: (state) => {
    return undefined;
  },
};

const persistConfig={
    key:"maya-vriksh",
    version: 0,
    storage,
    migrate:createMigrate(migrationConfig, { debug: false }),
}

const persistedReducer = persistReducer(persistConfig, rawPersistedReducer);

const rootReducer = {
    persisted: persistedReducer,
    common: commonReducer,
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;