
import axiosClient from "@/hooks/axiosClient"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchOverviewData = createAsyncThunk(
  "overview/fetchOverviewData",
  async (id: string) => {
    const response = await axiosClient.get(`${import.meta.env.VITE_APP_API_URL}/agents/${id}/getOverviewData`)
    return response.data
  }
)

interface OverviewState {
  loading: boolean
  data: any
  error: string | null
}

const initialState: OverviewState = {
  loading: false,
  data: null,
  error: null,
}

const overviewSlice = createSlice({
  name: "overview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverviewData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOverviewData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchOverviewData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Something went wrong"
      })
  },
})

export default overviewSlice.reducer

