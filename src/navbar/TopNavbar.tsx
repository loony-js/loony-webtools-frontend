/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate, NavigateFunction, Link } from "react-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { AuthStatus } from "loony-types"
import { useLogout } from "loony-web-api"
import type { AppContextProps, AuthContextProps } from "loony-types"
import {
  Bell,
  Plus,
  ChevronDown,
  Menu,
  Search,
  Code2,
  Book,
  Users,
  Settings,
  LogOut,
  User,
  GitPullRequest,
  AlertCircle,
  CheckCircle,
  X,
  Star,
  GitFork,
} from "lucide-react"
import {} from ".."

const TopNavbar = ({
  authContext,
  appContext,
  setMobileNavOpen,
}: {
  appContext: AppContextProps
  authContext: AuthContextProps
  setMobileNavOpen: any
}) => {
  const navigate: NavigateFunction = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { onLogout } = useLogout()
  const user = {}
  // const { user, logout } = useAuth()
  // const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null)
  const createMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
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
    // <nav className="flex fixed w-full h-16 py-auto">
    //   {/* Logo */}
    //   <div className="flex items-center w-72 px-4 bg-white dark:bg-[#131313] text-black dark:text-white">
    //     {/* <Menu
    //       className="block lg:hidden mr-2"
    //       onClick={() => {
    //         setMobileNavOpen((prevState: boolean) => !prevState)
    //       }}
    //     /> */}
    //     <a href="/" className="text-xl font-bold">
    //       Loony
    //     </a>
    //   </div>

    //   {/* Menu */}
    //   <div className="flex-1 flex items-center justify-end bg-gray-50 dark:bg-[#212121] text-black dark:text-white hidden md:flex md:items-center pr-10 py-2 px-4">
    //     {authContext.status === AuthStatus.AUTHORIZED ? (
    //       <AuthNavRight logoutUser={logoutUser} />
    //     ) : (
    //       <NotAuthNavRight />
    //     )}
    //   </div>
    // </nav>
    <header className="bg-navbar border-b border-[#30363d] px-4 py-2 sticky top-0 z-50">
      <div className="flex justify-between mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-4">
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
            className="text-white hover:text-[#58a6ff] transition-colors"
          >
            <Code2 size={32} />
          </Link>

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
                className="bg-[#0d1117] border border-[#30363d] rounded-md pl-10 pr-4 py-1.5 w-80 text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] text-[#c9d1d9] placeholder-[#8b949e] transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8b949e] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d] hidden sm:block">
                /
              </kbd>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          {/* <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-[#8b949e] hover:text-white p-2 rounded-md hover:bg-[#21262d] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#f9826c] rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl overflow-hidden animate-slideDown">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                  <h3 className="text-sm font-semibold text-white">
                    Notifications
                  </h3>
                  <button className="text-xs text-[#58a6ff] hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-[#21262d] cursor-pointer transition-colors ${
                        !notification.read ? "bg-[#1c2128]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#c9d1d9]">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#8b949e] mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#58a6ff] rounded-full mt-1.5"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-[#30363d]">
                  <button className="w-full text-center text-sm text-[#58a6ff] hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div> */}

          {/* Create Dropdown */}
          <div className="relative" ref={createMenuRef}>
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-1 text-[#8b949e] hover:text-white p-2 rounded-md hover:bg-[#21262d] transition-colors"
              aria-label="Create"
            >
              <Plus size={20} />
              <ChevronDown size={16} className="hidden sm:block" />
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl overflow-hidden animate-slideDown">
                <div className="py-2">
                  <Link
                    to="/new/repository"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[#21262d] transition-colors"
                  >
                    <Book size={16} className="text-[#8b949e]" />
                    <div>
                      <div className="text-sm text-white">New repository</div>
                      <div className="text-xs text-[#8b949e]">
                        Create a new repository
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/new/organization"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[#21262d] transition-colors"
                  >
                    <Users size={16} className="text-[#8b949e]" />
                    <div>
                      <div className="text-sm text-white">New organization</div>
                      <div className="text-xs text-[#8b949e]">
                        Create a new organization
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown */}
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
                className="w-8 h-8 rounded-full border border-[#30363d]"
              />
              <ChevronDown
                size={16}
                className="text-[#8b949e] hidden sm:block"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl overflow-hidden animate-slideDown">
                <div className="px-4 py-3 border-b border-[#30363d]">
                  <p className="text-sm font-semibold text-white">
                    {user?.username}
                  </p>
                  <p className="text-xs text-[#8b949e] mt-0.5">{user?.email}</p>
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
                <div className="border-t border-[#30363d] py-2">
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
        </div>
      </div>
    </header>
  )
}

const AuthNavRight = ({ logoutUser }: any) => {
  return (
    <>
      <ul className="">
        <li className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-stone-200 hover:dark:bg-[#363636] rounded-sm transition duration-200">
          <a href="#" onClick={logoutUser} className="">
            Logout
          </a>
        </li>
      </ul>
    </>
  )
}

const NotAuthNavRight = () => {
  return (
    <>
      <ul className="flex flex-col md:flex-row md:space-x-6 mt-3 md:mt-0">
        <li>
          <a href="/login" className="block py-2">
            Login
          </a>
        </li>
      </ul>
    </>
  )
}

const ActivityButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<any>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  return (
    <li className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-stone-100 hover:bg-stone-200 dark:bg-[#2e2e2e] hover:dark:bg-[#363636] rounded-sm transition duration-200"
      >
        Create
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md px-1 bg-white dark:bg-[#2e2e2e] shadow-xl ring-1 ring-gray-200 dark:ring-gray-900 z-50 animate-fade-in">
          <ul className="py-2 text-sm">
            <li>
              <a
                href="/create/book"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#4d4d4d] transition duration-150"
              >
                Book
              </a>
            </li>
            <li>
              <a
                href="/create/blog"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#4d4d4d] transition duration-150"
              >
                Blog
              </a>
            </li>
          </ul>
        </div>
      )}
    </li>
  )
}

export default TopNavbar
