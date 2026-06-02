// src/store/slices/analyticsSlice.ts

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { getAnalytics } from "../../api/analyticsApi";

export const fetchAnalytics =
  createAsyncThunk(
    "analytics/fetchAnalytics",
    async () => {
      return await getAnalytics();
    }
  );

interface AnalyticsState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(
        fetchAnalytics.pending,
        state => {
          state.loading = true;
        }
      )

      .addCase(
        fetchAnalytics.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
        }
      )

      .addCase(
        fetchAnalytics.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error.message ||
            "Something went wrong";
        }
      );
  },
});

export default analyticsSlice.reducer;