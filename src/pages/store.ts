import { configureStore } from "@reduxjs/toolkit";
import { booksApi } from "../pages/bookApi"; 
import uiReducer from "../pages/uislice"; 

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    ui: uiReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
