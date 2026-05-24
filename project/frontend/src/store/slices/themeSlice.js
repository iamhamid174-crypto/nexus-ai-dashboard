import { createSlice } from '@reduxjs/toolkit'

const stored = localStorage.getItem('saas_theme')
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const initialTheme = stored || (systemPrefersDark ? 'dark' : 'light')

if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initialTheme, accentColor: 'brand' },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('saas_theme', state.mode)
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem('saas_theme', state.mode)
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload
    },
  },
})

export const { toggleTheme, setTheme, setAccentColor } = themeSlice.actions

export const selectTheme = (state) => state.theme.mode
export const selectAccentColor = (state) => state.theme.accentColor

export default themeSlice.reducer
