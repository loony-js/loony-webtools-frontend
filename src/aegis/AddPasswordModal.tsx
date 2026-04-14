import { useState, useEffect, useRef } from "react"
import {
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  ShieldCheck,
  Globe,
  Briefcase,
  CreditCard,
  User,
} from "lucide-react"

// ─── Password strength ────────────────────────────────────────────────────────

function scorePassword(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 14) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

function getStrength(pw) {
  const score = scorePassword(pw)
  if (!pw) return null
  if (score <= 1)
    return {
      label: "Weak",
      segments: 1,
      color: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
    }
  if (score <= 3)
    return {
      label: "Medium",
      segments: 2,
      color: "bg-amber-400",
      text: "text-amber-600 dark:text-amber-400",
    }
  return {
    label: "Strong",
    segments: 4,
    color: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  }
}

function StrengthMeter({ password }) {
  const str = getStrength(password)
  if (!str) return null
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          Strength
        </span>
        <span className={`text-[11px] font-medium ${str.text}`}>
          {str.label}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < str.segments ? str.color : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Password generator ───────────────────────────────────────────────────────

const CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

function generatePassword(length = 18) {
  return Array.from(
    { length },
    () => CHARSET[Math.floor(Math.random() * CHARSET.length)],
  ).join("")
}

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "social", label: "Social", icon: Globe },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "finance", label: "Finance", icon: CreditCard },
  { id: "personal", label: "Personal", icon: User },
]

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ label, optional, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {label}
        {optional && (
          <span className="text-[10px] font-normal normal-case tracking-normal text-zinc-400 dark:text-zinc-600">
            (optional)
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  "w-full h-9 px-3 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/40 transition-all"

// ─── Main modal ───────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  url: "",
  username: "",
  password: "",
  mpassword: "",
  category: "social",
  notes: "",
}

/**
 * AddPasswordModal
 *
 * Props:
 *   open        {boolean}           — controls visibility
 *   onClose     {() => void}        — called when modal should close
 *   onSave      {(entry) => void}   — called with the new entry object on submit
 *   initialData {object}            — optional, pre-fills the form (for edit mode)
 */
export default function AddPasswordModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [showMPassword, setShowMPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const firstInputRef = useRef(null)

  // Populate form when initialData changes (edit mode)
  useEffect(() => {
    if (initialData) {
      setForm({ ...EMPTY_FORM, ...initialData })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
    setSaved(false)
  }, [initialData, open])

  // Focus first field when modal opens
  useEffect(() => {
    if (open) setTimeout(() => firstInputRef.current?.focus(), 80)
  }, [open])

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = "Name is required"
    if (!form.username.trim()) e.username = "Username or email is required"
    if (!form.password) e.password = "Password is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleGenerate() {
    const pw = generatePassword()
    set("password", pw)
    setShowPassword(true)
  }

  function handleSubmit() {
    if (!validate()) return
    const entry = {
      ...form,
      id: initialData?.id ?? crypto.randomUUID(),
      strength: getStrength(form.password)?.label?.toLowerCase() ?? "medium",
      updatedAt: "Just now",
    }
    onSave?.(entry)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose?.()
    }, 800)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <ShieldCheck
                  size={15}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>
              <h2
                id="modal-title"
                className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100"
              >
                {initialData ? "Edit password" : "New password"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-all"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
            {/* Name */}
            <Field label="Name">
              <input
                ref={firstInputRef}
                type="text"
                className={`${inputCls} ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/40" : ""}`}
                placeholder="e.g. Facebook"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                  {errors.name}
                </p>
              )}
            </Field>

            {/* URL */}
            <Field label="Website URL" optional>
              <input
                type="url"
                className={inputCls}
                placeholder="https://example.com"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
              />
            </Field>

            {/* Username */}
            <Field label="Username / Email">
              <input
                type="text"
                className={`${inputCls} ${errors.username ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/40" : ""}`}
                placeholder="your@email.com"
                value={form.username}
                onChange={(e) => set("username", e.target.value)}
              />
              {errors.username && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                  {errors.username}
                </p>
              )}
            </Field>

            {/* Password */}
            <Field label="Password">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputCls} pr-[72px] font-mono text-xs tracking-wide ${
                    errors.password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/40"
                      : ""
                  }`}
                  placeholder="Enter or generate a password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
                <div className="absolute right-1.5 flex items-center gap-0.5">
                  {/* Show / hide */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-all"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  {/* Generate */}
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-all"
                    title="Generate strong password"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                  {errors.password}
                </p>
              )}
              <StrengthMeter password={form.password} />
            </Field>

            <Field label="Master Password">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputCls} pr-[72px] font-mono text-xs tracking-wide ${
                    errors.mpassword
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/40"
                      : ""
                  }`}
                  placeholder="Enter master password"
                  value={form.mpassword}
                  onChange={(e) => set("mpassword", e.target.value)}
                />
                <div className="absolute right-1.5 flex items-center gap-0.5">
                  {/* Show / hide */}
                  <button
                    type="button"
                    onClick={() => setShowMPassword((v) => !v)}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-all"
                    title={showMPassword ? "Hide password" : "Show password"}
                  >
                    {showMPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              {errors.mpassword && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                  {errors.mpassword}
                </p>
              )}
              {/* <StrengthMeter password={form.password} /> */}
            </Field>

            {/* Category */}
            <Field label="Category">
              <div className="grid grid-cols-4 gap-1.5">
                {CATEGORIES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => set("category", id)}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-[11px] transition-all duration-150 ${
                      form.category === id
                        ? "border-violet-400 bg-violet-50 text-violet-700 font-medium dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
                        : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            {/* Notes */}
            <Field label="Notes" optional>
              <textarea
                rows={3}
                className={`${inputCls} h-auto py-2 resize-none leading-relaxed`}
                placeholder="Any additional notes…"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white active:scale-[0.98] transition-all ${
                saved
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
            >
              {saved ? (
                <>
                  <Check size={13} />
                  Saved!
                </>
              ) : (
                <>
                  <ShieldCheck size={13} />
                  {initialData ? "Update password" : "Save password"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
