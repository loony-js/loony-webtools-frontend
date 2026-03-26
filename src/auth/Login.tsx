import { useState } from "react"
import { AuthStatus } from "../context/AuthContext"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useNavigate } from "react-router"
import { useLogin } from "../hooks/auth"

// Define proper types
interface AuthContextType {
  setAuthContext: (context: { user: any; status: AuthStatus }) => void
}

interface FormData {
  username: string
  password: string
}

interface FormErrors {
  username?: string
  password?: string
}

function Login({ authContext }: { authContext: AuthContextType }) {
  const navigate = useNavigate()
  const { handleLogin, isLoading, error } = useLogin()

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState<FormErrors>({})

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {}

    if (!formData.username.trim()) {
      errors.username = "Username or email is required"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    return errors
  }

  const errors = validateForm()
  const isValid = Object.keys(errors).length === 0

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Mark all fields as touched on submit
    setTouched({
      username: true,
      password: true,
    })

    if (!isValid) return

    try {
      const user = await handleLogin(formData)
      authContext.setAuthContext({
        user,
        status: AuthStatus.AUTHORIZED,
      })
      navigate("/")
    } catch {
      // Error is handled in the hook
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="flex-1 min-h-screen ml-64 bg-loony-dark pt-16">
      <div className="flex-1 mx-auto">
        <div className="max-w-md mx-auto mt-10 p-6 rounded-lg border border-[#4d4d4d]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username / Email Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => handleBlur("username")}
                className={`
                  w-full px-4 py-2 border rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  ${
                    touched.username && errors.username
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } text-gray-900 dark:text-white
                `}
                autoComplete="username"
                aria-invalid={touched.username && !!errors.username}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
              />
              {touched.username && errors.username && (
                <p
                  id="username-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`
                    w-full px-4 py-2 border rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                    ${
                      touched.password && errors.password
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }
                    text-gray-900 dark:text-white
                    pr-10
                  `}
                  autoComplete="current-password"
                  aria-invalid={touched.password && !!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />

                {formData.password && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <IoEyeOff className="w-5 h-5" />
                    ) : (
                      <IoEye className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              {touched.password && errors.password && (
                <p
                  id="password-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* API Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-2 rounded-md transition font-medium
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-800 active:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-800"
                }
                text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <span>Don't have an account?</span>
            <a
              href="/register"
              className="ml-1 font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:underline"
            >
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
