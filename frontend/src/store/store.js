import { configureStore } from "@reduxjs/toolkit";
import leadReducer from "./leadSlice";

const store = configureStore({
    reducer: {
        lead: leadReducer,
    }
});

export default store;