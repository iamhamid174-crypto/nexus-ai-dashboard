import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchProjects = createAsyncThunk('projects/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/projects', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const createProject = createAsyncThunk('projects/create', async (projectData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/projects', projectData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateProject = createAsyncThunk('projects/update', async ({ id, ...projectData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/projects/${id}`, projectData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    selectedProject: null,
  },
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload
    },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.projects
        state.total = action.payload.total
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload.project)
        state.total++
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload.project._id)
        if (idx !== -1) state.items[idx] = action.payload.project
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload)
        state.total--
      })
  },
})

export const { setSelectedProject, clearError } = projectSlice.actions
export default projectSlice.reducer
