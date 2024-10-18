import { configureStore } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice";
import productsReducer from "./productsSlice";

const rootReducer = {
  invoices: invoicesReducer,
  products: productsReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export default rootReducer;
