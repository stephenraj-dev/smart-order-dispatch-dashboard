import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    totalOrders: 0,
    activeRiders: 0,
    successRate: 0,
    avgDeliveryTime: 0,
  },
  reducers: {
    setMetrics: (state, action) => action.payload,
  }
});

export const { setMetrics } = dashboardSlice.actions;
export default dashboardSlice.reducer;