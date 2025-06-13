import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "./slices/ApiSlice";

export const store = configureStore({
    reducer: {
        // api: apiSlice.reducer, // Uncomment this line if you have an apiSlice
  },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
