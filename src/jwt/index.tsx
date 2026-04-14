import { useState, useCallback } from "react"

// ─── Helpers ────────────────────────────────────────────────────────────────

function base64urlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64urlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4
  const base64 = pad ? padded + "=".repeat(4 - pad) : padded
  return atob(base64)
}

async function hmacSign(header, payload, secret, isBase64) {
  const data = `${base64urlEncode(JSON.stringify(header))}.${base64urlEncode(
    JSON.stringify(payload),
  )}`
  let keyData
  if (isBase64) {
    const binaryStr = atob(secret.replace(/-/g, "+").replace(/_/g, "/"))
    keyData = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0))
  } else {
    keyData = new TextEncoder().encode(secret)
  }
  const alg =
    header.alg === "HS384"
      ? "SHA-384"
      : header.alg === "HS512"
        ? "SHA-512"
        : "SHA-256"
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: alg },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(data),
  )
  return (
    data +
    "." +
    btoa(String.fromCharCode(...new Uint8Array(sig)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  )
}

async function hmacVerify(header, payload, signature, secret, isBase64) {
  const data = `${base64urlEncode(JSON.stringify(header))}.${base64urlEncode(
    JSON.stringify(payload),
  )}`
  let keyData
  if (isBase64) {
    const binaryStr = atob(secret.replace(/-/g, "+").replace(/_/g, "/"))
    keyData = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0))
  } else {
    keyData = new TextEncoder().encode(secret)
  }
  const alg =
    header.alg === "HS384"
      ? "SHA-384"
      : header.alg === "HS512"
        ? "SHA-512"
        : "SHA-256"
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: alg },
    false,
    ["verify"],
  )
  const padded = signature.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4
  const base64sig = pad ? padded + "=".repeat(4 - pad) : padded
  const sigBytes = Uint8Array.from(atob(base64sig), (c) => c.charCodeAt(0))
  return crypto.subtle.verify(
    "HMAC",
    cryptoKey,
    sigBytes,
    new TextEncoder().encode(data),
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
      title="Copy"
    >
      {copied ? (
        <svg
          className="w-4 h-4 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  )
}

function ClearButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
      title="Clear"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )
}

function Panel({ label, children, actions }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
        <span className="text-xs font-mono font-semibold text-gray-300 tracking-widest uppercase">
          <span className="text-purple-400 mr-1">_{"> "}</span>
          {label}
        </span>
        <div className="flex gap-1">{actions}</div>
      </div>
      {children}
    </div>
  )
}

// ─── JWT Decoder ─────────────────────────────────────────────────────────────

function JWTDecoder() {
  const [token, setToken] = useState("")
  const [secret, setSecret] = useState("")
  const [secretBase64, setSecretBase64] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null) // null | true | false | "error"
  const [verifying, setVerifying] = useState(false)

  let header = null,
    payload = null,
    parts = [],
    decodeError = null
  if (token.trim()) {
    try {
      parts = token.trim().split(".")
      if (parts.length !== 3) throw new Error("JWT must have 3 parts")
      header = JSON.parse(base64urlDecode(parts[0]))
      payload = JSON.parse(base64urlDecode(parts[1]))
    } catch (e) {
      decodeError = e.message
    }
  }

  const isValid = !!header && !!payload

  const handleVerify = async () => {
    if (!isValid || !secret) return
    setVerifying(true)
    try {
      const result = await hmacVerify(
        header,
        payload,
        parts[2],
        secret,
        secretBase64,
      )
      setVerifyResult(result ? "valid" : "invalid")
    } catch {
      setVerifyResult("error")
    }
    setVerifying(false)
  }

  const formatTimestamp = (val) => {
    if (typeof val === "number" && val > 1e9) {
      return new Date(val * 1000).toUTCString()
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left: Encoded token */}
      <Panel
        label="Encoded Token"
        actions={[
          token && <CopyButton key="copy" text={token} />,
          token && (
            <ClearButton
              key="clear"
              onClick={() => {
                setToken("")
                setVerifyResult(null)
              }}
            />
          ),
        ]}
      >
        <textarea
          className="w-full h-52 bg-transparent text-sm font-mono px-4 py-3 resize-none focus:outline-none text-purple-300 placeholder-gray-600"
          placeholder="Paste a JWT here…"
          value={token}
          onChange={(e) => {
            setToken(e.target.value)
            setVerifyResult(null)
          }}
          spellCheck={false}
        />
        <div className="px-4 py-2 border-t border-white/10 flex items-center gap-2 text-xs">
          {!token.trim() ? null : decodeError ? (
            <span className="text-red-400 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Invalid JWT — {decodeError}
            </span>
          ) : (
            <span className="text-green-400 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Valid JWT
            </span>
          )}
        </div>
      </Panel>

      {/* Right: Decoded */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <Panel
          label="Decoded Header"
          actions={
            header
              ? [<CopyButton key="c" text={JSON.stringify(header, null, 2)} />]
              : []
          }
        >
          <pre className="px-4 py-3 text-sm font-mono text-gray-200 overflow-auto max-h-36">
            {header ? (
              JSON.stringify(header, null, 2)
            ) : (
              <span className="text-gray-600 italic">{"{ }"}</span>
            )}
          </pre>
        </Panel>

        {/* Payload */}
        <Panel
          label="Decoded Payload"
          actions={
            payload
              ? [<CopyButton key="c" text={JSON.stringify(payload, null, 2)} />]
              : []
          }
        >
          <pre className="px-4 py-3 text-sm font-mono text-gray-200 overflow-auto max-h-48">
            {payload ? (
              <span>
                {"{\n"}
                {Object.entries(payload).map(([k, v]) => {
                  const ts =
                    k === "iat" || k === "exp" || k === "nbf"
                      ? formatTimestamp(v)
                      : null
                  return (
                    <span key={k}>
                      {"  "}
                      <span className="text-gray-400">"{k}"</span>
                      {": "}
                      <span className="text-green-300">
                        {JSON.stringify(v)}
                      </span>
                      {ts && (
                        <span className="text-gray-500 text-xs ml-2">
                          // {ts}
                        </span>
                      )}
                      {"\n"}
                    </span>
                  )
                })}
                {"}"}
              </span>
            ) : (
              <span className="text-gray-600 italic">{"{ }"}</span>
            )}
          </pre>
        </Panel>

        {/* Signature Verification */}
        <Panel label="Signature Verification (Optional)">
          <div className="px-4 py-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Secret key</span>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                <span>Base64URL encoded</span>
                <button
                  role="switch"
                  aria-checked={secretBase64}
                  onClick={() => setSecretBase64((p) => !p)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${secretBase64 ? "bg-purple-500" : "bg-white/20"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${secretBase64 ? "translate-x-4" : ""}`}
                  />
                </button>
              </label>
            </div>
            <textarea
              className="w-full h-16 bg-black/20 border border-white/10 rounded-lg text-sm font-mono px-3 py-2 resize-none focus:outline-none focus:border-purple-500/50 text-gray-200 placeholder-gray-600"
              placeholder="Enter secret to verify signature…"
              value={secret}
              onChange={(e) => {
                setSecret(e.target.value)
                setVerifyResult(null)
              }}
              spellCheck={false}
            />
            <button
              onClick={handleVerify}
              disabled={!isValid || !secret || verifying}
              className="self-start px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {verifying ? "Verifying…" : "Verify Signature"}
            </button>
            {verifyResult && (
              <div
                className={`flex items-center gap-1.5 text-xs font-medium ${verifyResult === "valid" ? "text-green-400" : "text-red-400"}`}
              >
                {verifyResult === "valid" ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Signature verified
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {verifyResult === "error"
                      ? "Verification error — unsupported algorithm or bad key"
                      : "Signature invalid"}
                  </>
                )}
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}

// ─── JWT Encoder ─────────────────────────────────────────────────────────────

const ALGORITHMS = ["HS256", "HS384", "HS512"]

const DEFAULT_PAYLOAD = {
  sub: "1234567890",
  name: "John Doe",
  admin: true,
  iat: Math.floor(Date.now() / 1000),
}

function JWTEncoder() {
  const [algorithm, setAlgorithm] = useState("HS256")
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(DEFAULT_PAYLOAD, null, 2),
  )
  const [secret, setSecret] = useState("a-string-secret-at-least-256-bits-long")
  const [secretBase64, setSecretBase64] = useState(false)
  const [encoded, setEncoded] = useState("")
  const [encoding, setEncoding] = useState(false)
  const [error, setError] = useState("")

  const payloadValid = useCallback(() => {
    try {
      JSON.parse(payloadText)
      return true
    } catch {
      return false
    }
  }, [payloadText])

  const handleEncode = async () => {
    setError("")
    let parsedPayload
    try {
      parsedPayload = JSON.parse(payloadText)
    } catch {
      setError("Invalid JSON in payload")
      return
    }
    if (!secret) {
      setError("Secret is required")
      return
    }
    setEncoding(true)
    try {
      const header = { alg: algorithm, typ: "JWT" }
      const token = await hmacSign(header, parsedPayload, secret, secretBase64)
      setEncoded(token)
    } catch (e) {
      setError(e.message || "Encoding failed")
    }
    setEncoding(false)
  }

  const addClaim = (key, value) => {
    try {
      const obj = JSON.parse(payloadText)
      obj[key] = value
      setPayloadText(JSON.stringify(obj, null, 2))
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left: Inputs */}
      <div className="flex flex-col gap-4">
        {/* Algorithm */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            Algorithm
          </span>
          <div className="flex gap-1">
            {ALGORITHMS.map((a) => (
              <button
                key={a}
                onClick={() => setAlgorithm(a)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${algorithm === a ? "bg-purple-600 text-white" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Payload */}
        <Panel
          label="Payload (JSON)"
          actions={[
            <button
              key="iat"
              onClick={() => addClaim("iat", Math.floor(Date.now() / 1000))}
              className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
            >
              + iat
            </button>,
            <button
              key="exp"
              onClick={() =>
                addClaim("exp", Math.floor(Date.now() / 1000) + 3600)
              }
              className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
            >
              + exp
            </button>,
          ]}
        >
          <textarea
            className={`w-full h-52 bg-transparent text-sm font-mono px-4 py-3 resize-none focus:outline-none placeholder-gray-600 ${payloadValid() ? "text-gray-200" : "text-red-400"}`}
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            spellCheck={false}
          />
          <div className="px-4 py-2 border-t border-white/10 text-xs">
            {payloadValid() ? (
              <span className="text-green-400 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Valid JSON
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Invalid JSON
              </span>
            )}
          </div>
        </Panel>

        {/* Secret */}
        <Panel label="Secret">
          <div className="px-4 py-3 flex flex-col gap-3">
            <div className="flex items-center justify-end">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                <span>Base64URL encoded</span>
                <button
                  role="switch"
                  aria-checked={secretBase64}
                  onClick={() => setSecretBase64((p) => !p)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${secretBase64 ? "bg-purple-500" : "bg-white/20"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${secretBase64 ? "translate-x-4" : ""}`}
                  />
                </button>
              </label>
            </div>
            <input
              className="w-full bg-black/20 border border-white/10 rounded-lg text-sm font-mono px-3 py-2 focus:outline-none focus:border-purple-500/50 text-gray-200 placeholder-gray-600"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Your secret key…"
              spellCheck={false}
            />
          </div>
        </Panel>

        <button
          onClick={handleEncode}
          disabled={encoding || !payloadValid() || !secret}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {encoding ? "Encoding…" : "Generate JWT"}
        </button>

        {error && <p className="text-red-400 text-xs px-1">{error}</p>}
      </div>

      {/* Right: Encoded output */}
      <div className="flex flex-col gap-4">
        <Panel
          label="Encoded Token"
          actions={
            encoded
              ? [
                  <CopyButton key="c" text={encoded} />,
                  <ClearButton key="cl" onClick={() => setEncoded("")} />,
                ]
              : []
          }
        >
          <div className="px-4 py-3 min-h-40 font-mono text-sm break-all">
            {encoded ? (
              <span>
                <span className="text-red-400">{encoded.split(".")[0]}</span>
                <span className="text-gray-500">.</span>
                <span className="text-purple-400">{encoded.split(".")[1]}</span>
                <span className="text-gray-500">.</span>
                <span className="text-cyan-400">{encoded.split(".")[2]}</span>
              </span>
            ) : (
              <span className="text-gray-600 italic text-xs">
                Token will appear here after encoding…
              </span>
            )}
          </div>
        </Panel>

        {/* Preview decoded header */}
        {encoded && (
          <Panel label="Header Preview" actions={[]}>
            <pre className="px-4 py-3 text-sm font-mono text-gray-300">
              {JSON.stringify({ alg: algorithm, typ: "JWT" }, null, 2)}
            </pre>
          </Panel>
        )}
      </div>
    </div>
  )
}

// ─── Root Component ──────────────────────────────────────────────────────────

export default function JWTDebugger() {
  const [tab, setTab] = useState("decoder")

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-xs font-black">J</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">JWT Debugger</h1>
          </div>
          <p className="text-sm text-gray-500">
            Decode, verify, and generate JSON Web Tokens (RFC 7519)
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            {["decoder", "encoder"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                  tab === t
                    ? "bg-white text-black shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                JWT {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {tab === "decoder" ? <JWTDecoder /> : <JWTEncoder />}

        <p className="text-center text-xs text-gray-700 mt-10">
          HMAC (HS256 / HS384 / HS512) · Runs entirely in the browser · No data
          is sent to any server
        </p>
      </div>
    </div>
  )
}
