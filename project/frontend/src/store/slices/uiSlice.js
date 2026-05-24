import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    sidebarCollapsed: false,
    activeModal: null,
    modalData: null,
    toasts: [],
    searchOpen: false,
    notificationPanelOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal
      state.modalData = action.payload.data || null
    },
    closeModal: (state) => {
      state.activeModal = null
      state.modalData = null
    },
    addToast: (state, action) => {
      const id = Date.now().toString()
      state.toasts.push({ id, ...action.payload })
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen
    },
    toggleNotificationPanel: (state) => {
      state.notificationPanelOpen = !state.notificationPanelOpen
    },
    closeNotificationPanel: (state) => {
      state.notificationPanelOpen = false
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  openModal,
  closeModal,
  addToast,
  removeToast,
  toggleSearch,
  toggleNotificationPanel,
  closeNotificationPanel,
} = uiSlice.actions

export default uiSlice.reducer
