import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/axios";
import {
  RiderState,
} from "./riderTypes";

const initialState: RiderState = {
  riders: [],
  loading: false,
  error: null,
};

export const fetchRiders =
  createAsyncThunk(
    "riders/fetchRiders",
    async (_, thunkAPI) => {
      try {
        const response = await api.get(
          "/riders"
        );

        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch riders"
        );
      }
    }
  );

export const updateRiderStatus =
  createAsyncThunk(
    "riders/updateStatus",
    async (
      {
        riderId,
        status,
      }: {
        riderId: number;
        status: string;
      },
      thunkAPI
    ) => {
      try {
        const response = await api.post(
          `/riders/${riderId}/status`,
          { status }
        );

        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to update rider"
        );
      }
    }
  );

const riderSlice = createSlice({
  name: "riders",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchRiders.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchRiders.fulfilled,
        (state, action) => {
          state.loading = false;
          state.riders = action.payload;
        }
      )

      .addCase(
        fetchRiders.rejected,
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        updateRiderStatus.fulfilled,
        (state, action) => {
          const updated =
              action.payload.rider;

            const index =
              state.riders.findIndex(
                (r) =>
                  r.id === updated.id
              );

            if (index !== -1) {
              state.riders[index] =
                updated;
            }
        }
      );
  },
});

export default riderSlice.reducer;