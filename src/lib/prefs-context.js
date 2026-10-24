import { createContext, useContext } from 'react'

export const PrefsContext = createContext(null)

export function usePrefs() {
  return useContext(PrefsContext)
}
