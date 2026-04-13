import { createContext, useState, ReactNode, useEffect } from "react"
import { AppContextProps, AppState } from "loony-types"
import config from "../../config/app.config.json"

const appConfig: any = config
const currentConfig: any = appConfig[config.NODE_ENV]
const { API_URL } = currentConfig

const AppContext = createContext<AppContextProps>({
  env: {
    base_url: API_URL,
  },
  device: {
    type: "desktop",
    width: 1920,
    height: 1080,
  },
  isDark: true,
  api: null,
  setAppContext: () => {
    return
  },
})

// Read persisted theme before first render to avoid a flash
const getInitialTheme = (): boolean => {
  const stored = localStorage.getItem("theme")
  if (stored === "dark") return true
  if (stored === "light") return false
  // Fall back to OS preference if nothing stored
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setAppContext] = useState<AppState>({
    env: {
      base_url: API_URL,
    },
    device: {
      type: "desktop",
      width: 1920,
      height: 1080,
    },
    isDark: getInitialTheme(),
    api: null,
  })

  // Detect device type once on mount only
  useEffect(() => {
    if (window.innerWidth <= 720) {
      setAppContext((prev) => ({
        ...prev,
        device: { ...prev.device, type: "mobile" },
      }))
    }
  }, [])

  // Sync theme class + localStorage whenever isDark changes
  useEffect(() => {
    const html = document.documentElement
    if (state.isDark) {
      html.classList.add("dark")
      html.classList.remove("light")
      localStorage.setItem("theme", "dark")
    } else {
      html.classList.add("light")
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [state.isDark])

  return (
    <AppContext.Provider value={{ ...state, setAppContext }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
