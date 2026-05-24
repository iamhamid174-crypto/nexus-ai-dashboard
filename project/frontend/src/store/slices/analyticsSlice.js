import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async (period = '30d') => {
  const { data } = await api.get(`/analytics?period=${period}`)
  return data
})

export const fetchDashboardStats = createAsyncThunk('analytics/dashboardStats', async () => {
  const { data } = await api.get('/dashboard/stats')
  return data
})

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    dashboardStats: null,
    revenueData: [],
    userGrowthData: [],
    aiUsageData: [],
    trafficSources: [],
    period: '30d',
    loading: false,
    statsLoading: false,
  },
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.revenueData = action.payload.revenueData || []
        state.userGrowthData = action.payload.userGrowthData || []
        state.aiUsageData = action.payload.aiUsageData || []
        state.trafficSources = action.payload.trafficSources || []
      })
      .addCase(fetchDashboardStats.pending, (state) => { state.statsLoading = true })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false
        state.dashboardStats = action.payload
      })
  },
})

export const { setPeriod } = analyticsSlice.actions
export default analyticsSlice.reducer
