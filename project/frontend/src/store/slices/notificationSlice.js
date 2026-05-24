import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const { data } = await api.get('/notifications')
  return data
})

export const markAllRead = createAsyncThunk('notifications/markAllRead', async () => {
  await api.put('/notifications/read-all')
  return true
})

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    markOneRead: (state, action) => {
      const n = state.items.find((i) => i._id === action.payload)
      if (n && !n.read) {
        n.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload)
      if (!action.payload.read) state.unreadCount++
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.notifications || []
        state.unreadCount = state.items.filter((n) => !n.read).length
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }))
        state.unreadCount = 0
      })
  },
})

export const { markOneRead, addNotification } = notificationSlice.actions
export default notificationSlice.reducer
