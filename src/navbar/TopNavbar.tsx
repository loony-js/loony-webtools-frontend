import { useNavigate, NavigateFunction, Link } from "react-router"
import { useCallback, useRef, useState } from "react"
import { AuthStatus } from "loony-types"
import { useLogout } from "loony-web-api"
import type { AppContextProps, AuthContextProps } from "loony-types"
import {
  ChevronDown,
  Menu,
  Search,
  Code2,
  Book,
  Settings,
  LogOut,
  User,
} from "lucide-react"
import {} from ".."

const TopNavbar = ({
  authContext,
}: {
  appContext: AppContextProps
  authContext: AuthContextProps
  setMobileNavOpen: any
}) => {
  const navigate: NavigateFunction = useNavigate()
  const { onLogout } = useLogout()
  const { user, status } = authContext
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null)
  const onLogoutSuccess = useCallback(() => {
    authContext.setAuthContext({
      status: AuthStatus.UNAUTHORIZED,
      user: null,
    })
    navigate("/", { replace: true })
  }, [authContext, navigate])

  const onLogoutError = () => {}

  const logoutUser = useCallback(() => {
    onLogout(onLogoutSuccess, onLogoutError)
  }, [onLogout, onLogoutSuccess])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="bg-layout-navbar px-4 py-2 sticky top-0 z-50">
      <div className="flex justify-between mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="w-72">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[#8b949e] hover:text-white transition-colors"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="text-text-primary hover:text-[#58a6ff] transition-colors"
            >
              {/* <Code2 size={32} /> */}
              Webtools
            </Link>
          </div>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:block">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]"
                size={16}
              />
              <input
                type="text"
                placeholder="Search or jump to..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-layout-navbar border border-layout-border rounded-md pl-10 pr-4 py-1.5 w-120 text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] text-[#c9d1d9] placeholder-[#8b949e] transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8b949e] bg-[#21262d] px-1.5 py-0.5 rounded border border-layout-border hidden sm:block">
                /
              </kbd>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* User Dropdown */}
          {status === AuthStatus.AUTHORIZED && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 hover:bg-[#21262d] rounded-md p-1 transition-colors"
                aria-label="User menu"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${user?.username}&background=58a6ff&color=fff&bold=true`
                  }
                  alt={user?.username}
                  className="w-8 h-8 rounded-full border border-layout-border"
                />
                <ChevronDown
                  size={16}
                  className="text-[#8b949e] hidden sm:block"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-layout-border rounded-lg shadow-xl overflow-hidden animate-slideDown">
                  <div className="px-4 py-3 border-b border-layout-border">
                    <p className="text-sm font-semibold text-white">
                      {user?.username}
                    </p>
                    <p className="text-xs text-[#8b949e] mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      to={`/${user?.username}`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#21262d] transition-colors"
                    >
                      <User size={16} className="text-[#8b949e]" />
                      <span className="text-sm text-white">Your profile</span>
                    </Link>
                    <Link
                      to="/repositories"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#21262d] transition-colors"
                    >
                      <Book size={16} className="text-[#8b949e]" />
                      <span className="text-sm text-white">
                        Your repositories
                      </span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#21262d] transition-colors"
                    >
                      <Settings size={16} className="text-[#8b949e]" />
                      <span className="text-sm text-white">Settings</span>
                    </Link>
                  </div>
                  <div className="border-t border-layout-border py-2">
                    <button
                      onClick={logoutUser}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#21262d] transition-colors text-left"
                    >
                      <LogOut size={16} className="text-[#8b949e]" />
                      <span className="text-sm text-white">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
