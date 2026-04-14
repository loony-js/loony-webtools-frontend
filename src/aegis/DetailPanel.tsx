import { useState } from "react"
import {
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Pencil,
  Trash2,
  Check,
} from "lucide-react"
import StrengthBar from "./StrengthBar"
import {
  getOneCredentialApi,
  decryptOneCredentialApi,
  deleteOneCredentialApi,
} from "../api/index"

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
]

function getAvatarColor(name = "") {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy"
      className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-all duration-150"
    >
      {copied ? (
        <Check size={13} className="text-emerald-500" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  )
}

function FieldRow({ label, value, mono = false, isLink = false, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-sm text-violet-600 dark:text-violet-400 truncate hover:underline"
          >
            {value}
          </a>
        ) : (
          <span
            className={`flex-1 text-sm text-zinc-800 dark:text-zinc-200 truncate ${
              mono ? "font-mono text-xs tracking-wide" : ""
            }`}
          >
            {value}
          </span>
        )}
        {children}
        {isLink && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-all"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  )
}

export default function DetailPanel({ entry, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false)
  const [master_password, setMasterPassword] = useState("")
  const [decrypted_password, setDecryptedPassword] = useState("")
  const [error, setError] = useState("")

  const onDecrypt = () => {
    if (master_password) {
      decryptOneCredentialApi({
        password: entry.values.password,
        master_password,
      })
        .then((res) => {
          if (res.data && res.data.password) {
            setDecryptedPassword(res.data.password)
            setError("")
          }
        })
        .then(() => {
          // onDecryptFinish()
        })
        .catch((err) => {
          console.log(err)
          setError("Invalid")
        })
    }
  }

  if (!entry) {
    return (
      <div className="w-72 shrink-0 flex items-center justify-center border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          Select an entry to view
        </p>
      </div>
    )
  }

  const avatarColor = getAvatarColor(entry.name)
  const displayPassword = showPassword ? entry.values.password : "•".repeat(16)

  return (
    <div className="w-120 shrink-0 flex flex-col border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-semibold shrink-0 ${avatarColor}`}
        >
          {entry.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {entry.name}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
            {entry.values.url?.replace(/^https?:\/\//, "")}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {entry.values.url && (
          <FieldRow label="Website" value={entry.values.url} isLink>
            <CopyButton value={entry.values.url} />
          </FieldRow>
        )}

        <FieldRow label="Username" value={entry.values.username}>
          <CopyButton value={entry.values.username} />
        </FieldRow>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Password
          </p>
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <span className="flex-1 text-xs font-mono tracking-wide text-zinc-800 dark:text-zinc-200 truncate">
              {decrypted_password ? decrypted_password : displayPassword}
            </span>
            <button
              onClick={() => setShowPassword((p) => !p)}
              title={showPassword ? "Hide" : "Show"}
              className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-all"
            >
              {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
            <CopyButton value={entry.values.password} />
          </div>
          <StrengthBar strength={entry.strength} />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Last updated
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {entry.updatedAt}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
        <button
          onClick={() => onEdit?.(entry)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-[0.98] transition-all"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={() => onEdit?.(entry)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-[0.98] transition-all"
        >
          Decrypt
        </button>
        <button
          onClick={() => onDelete?.(entry)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-200 dark:border-red-900/60 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  )
}
