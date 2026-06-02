import { configureStore } from "@reduxjs/toolkit";

import orderReducer from "../features/orders/orderSlice";
import riderReducer from "../features/riders/riderSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";
import dashboardSummaryReducer from "../features/dashboard/dashboardSummarySlice";

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    riders: riderReducer,
    analytics: analyticsReducer,
    dashboard: dashboardSummaryReducer,
  },
});

export type RootState =
  ReturnType<
    typeof store.getState
  >;

export type AppDispatch =
  typeof store.dispatch;