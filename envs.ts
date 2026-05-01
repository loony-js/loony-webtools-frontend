import fs from "fs"
import path from "path"
import os from "os"
import dotenv from "loony-dotenv"

const HOMEDIR = os.homedir()
dotenv(path.join(HOMEDIR, ".envs", "webtools", "front.env"))
dotenv(path.join(HOMEDIR, ".envs", "webtools", "back.env"))
dotenv(path.join(HOMEDIR, ".envs", "common.env"))

// CERTIFICATES
const readFileIfExists = (filePath?: string) => {
  return filePath && fs.existsSync(filePath)
    ? fs.readFileSync(filePath)
    : undefined
}

const CERTS = {
  key: readFileIfExists(process.env.KEY_PATH),
  cert: readFileIfExists(process.env.CERT_PATH),
}

// PORT
const WEB_HTTP_PORT = process.env.WEB_HTTP_PORT || 2004
const WEB_HTTPS_PORT = process.env.WEB_HTTPS_PORT || 3004
const NODE_HTTP_PORT = process.env.NODE_HTTP_PORT || 8004
const NODE_HTTPS_PORT = process.env.NODE_HTTPS_PORT || 9004
const AUTH_HTTP_PORT = process.env.AUTH_HTTP_PORT || 8000
const AUTH_HTTPS_PORT = process.env.AUTH_HTTPS_PORT || 9000
const NODE_ENV = process.env.APP_ENV || ""
const CORS_ORIGIN = process.env.CORS_ORIGIN || "2004,3004"

const PORT = NODE_ENV === "production" ? WEB_HTTPS_PORT : WEB_HTTP_PORT

// POSTGRES
const PG_HOSTNAME = process.env.PG_HOSTNAME || "localhost"
const PG_USERNAME = process.env.PG_USERNAME || "sankar"
const PG_DATABASE = process.env.PG_DATABASE || "github"
const PG_PASSWORD = process.env.PG_PASSWORD || null
const PG_PORT = process.env.PG_PORT || 5432
const PG_SSL = process.env.PG_SSL || false
const PG_POOL_MIN = process.env.PG_POOL_MIN || 2
const PG_POOL_MAX = process.env.PG_POOL_MAX || 10
const PG_POOL_IDLE_TIMEOUT = process.env.PG_POOL_IDLE_TIMEOUT || 30000
const PG_POOL_CONNECT_TIMEOUT = process.env.PG_POOL_CONNECT_TIMEOUT || 2000

// REDIS
const REDIS_ROUTE = process.env.REDIS_ROUTE || "redis://:sankar@127.0.0.1:6379/"

// MAILTRAP
const MAILTRAP_TOKEN_ID = process.env.MAILTRAP_TOKEN_ID || ""
const MAILTRAP_SANDBOX_ID = process.env.MAILTRAP_SANDBOX_ID || ""
const MAILTRAP_NAME = process.env.MAILTRAP_NAME || ""
const MAILTRAP_EMAIL = process.env.MAILTRAP_EMAIL || ""
const MAILTRAP_HOSTNAME = process.env.MAILTRAP_HOSTNAME || ""
const MAILTRAP_USERNAME = process.env.MAILTRAP_USERNAME || ""
const MAILTRAP_PASSWORD = process.env.MAILTRAP_PASSWORD || ""

// SECRET KEYS, TOKENS
const SECRET_KEY = process.env.SECRET_KEY || ""
const JWT_SECRET = process.env.JWT_SECRET || "ABC-DEF-GHI-JKL"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"
const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS
  ? parseInt(process.env.BCRYPT_ROUNDS, 10)
  : 10
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "ABC-DEF-GHI-JKL-MNO"
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"

// FILES
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 104857600
const STORAGE_PATH =
  process.env.STORAGE_PATH || path.join(HOMEDIR, "loonyrepos")

export {
  CERTS,
  //
  NODE_ENV,
  PORT,
  NODE_HTTP_PORT,
  NODE_HTTPS_PORT,
  AUTH_HTTP_PORT,
  AUTH_HTTPS_PORT,
  WEB_HTTP_PORT,
  WEB_HTTPS_PORT,
  CORS_ORIGIN,
  //
  PG_HOSTNAME,
  PG_USERNAME,
  PG_DATABASE,
  PG_PASSWORD,
  PG_PORT,
  PG_SSL,
  PG_POOL_MIN,
  PG_POOL_MAX,
  PG_POOL_IDLE_TIMEOUT,
  PG_POOL_CONNECT_TIMEOUT,
  //
  REDIS_ROUTE,
  //
  SECRET_KEY,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BCRYPT_ROUNDS,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  //
  MAX_FILE_SIZE,
  STORAGE_PATH,
}
