import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/axios";
import {
  OrderState,
  CreateOrderPayload,
} from "./orderTypes";

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/orders");

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch orders"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    orderData: CreateOrderPayload,
    thunkAPI
  ) => {
    try {
      const response = await api.post(
        "/orders",
        orderData
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to create order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const exists = state.orders.find(o => o.id === action.payload.id);
      if (!exists) {
        state.orders.push(action.payload);
      }
    }
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        fetchOrders.fulfilled,
        (state, action) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )

      .addCase(
        fetchOrders.rejected,
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        createOrder.fulfilled,
        (state) => {
          state.loading = false;
        }
      )

      .addCase(
        createOrder.rejected,
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;