import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { getDashboardSummary } from "../../api/dashboardApi";

export interface DashboardState {
  totalOrders: number;
  activeRiders: number;
  successRate: number;
  avgDeliveryTime: number;
  loading: boolean;
}

const initialState: DashboardState = {
  totalOrders: 0,
  activeRiders: 0,
  successRate: 0,
  avgDeliveryTime: 0,
  loading: false,
};

export const fetchDashboardSummary =
  createAsyncThunk(
    "dashboard/fetch",
    async () => {
      return await getDashboardSummary();
    }
  );

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    updateDashboard: (
      state,
      action
    ) => {
      state.totalOrders =
        action.payload.totalOrders;

      state.activeRiders =
        action.payload.activeRiders;

      state.successRate =
        action.payload.successRate;

      state.avgDeliveryTime =
        action.payload.avgDeliveryTime;
    },
  },

  extraReducers: builder => {
    builder

      .addCase(
        fetchDashboardSummary.pending,
        state => {
          state.loading = true;
        }
      )

      .addCase(
        fetchDashboardSummary.fulfilled,
        (state, action) => {

          state.loading = false;

          state.totalOrders =
            action.payload.totalOrders;

          state.activeRiders =
            action.payload.activeRiders;

          state.successRate =
            action.payload.successRate;

          state.avgDeliveryTime =
            action.payload.avgDeliveryTime;
        }
      )

      .addCase(
        fetchDashboardSummary.rejected,
        state => {
          state.loading = false;
        }
      );
  },
});

export const {
  updateDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;