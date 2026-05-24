import { useDispatch, useSelector } from 'react-redux'
import { addToast } from '../store/slices/uiSlice'
import { useCallback } from 'react'

// Typed dispatch/selector hooks
export const useAppDispatch = () => useDispatch()
export const useAppSelector = (selector) => useSelector(selector)

// Toast hook
export const useToast = () => {
  const dispatch = useAppDispatch()

  const toast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }) => {
      dispatch(addToast({ title, message, type, duration }))
    },
    [dispatch]
  )

  return {
    success: (title, message) => toast({ title, message, type: 'success' }),
    error: (title, message) => toast({ title, message, type: 'error' }),
    warning: (title, message) => toast({ title, message, type: 'warning' }),
    info: (title, message) => toast({ title, message, type: 'info' }),
  }
}

// Auth selector hook
export const useAuth = () => useSelector((s) => s.auth)

// Theme hook
export const useTheme = () => useSelector((s) => s.theme)

// Window size hook
import { useState, useEffect } from 'react'

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return size
}

// Click outside hook
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// Local storage hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Debounced value hook
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}
