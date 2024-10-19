import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: 1,
    name: "Product 1",
    price: 10.99,
    description: "Description for Product 1",
  },
  {
    id: 2,
    name: "Product 2",
    price: 15.99,
    description: "Description for Product 2",
  },
  {
    id: 3,
    name: "Product 3",
    price: 20.99,
    description: "Description for Product 3",
  },
];

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addProduct, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;
