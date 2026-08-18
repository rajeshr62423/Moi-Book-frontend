import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/reducer";
import eventReducer from "./event/reducer";
import vendorReducer from "./vendor/reducer";
import moiReducer from "./moi/reducer";
import guestReducer from "./guest/reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    vendor: vendorReducer,
    moi: moiReducer,
    guest: guestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
