import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import tailwindcssPostcss from "@tailwindcss/postcss"
import autoprefixer from "autoprefixer"
import fs from "fs"
import dotenv from "loony-dotenv"
import os from "os"
import path from "path"
const envPath = path.join(os.homedir(), ".envs", "wt_front.env")
dotenv(envPath)

const {
  APP_HTTP_PORT,
  APP_HTTPS_PORT,
  HTTPS_KEY_PATH,
  HTTPS_CERT_PATH,
  HTTPS,
} = process.env

const config: any = {
  server: {
    port: 3000,
    strictPort: true,
  },
  source: {
    define: {
      "process.env": JSON.stringify(process.env),
    },
  },
  plugins: [pluginReact()],
  html: {
    template: "./public/index.html",
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [tailwindcssPostcss, autoprefixer],
      },
    },
  },
}

if ((typeof HTTPS === "boolean" && HTTPS) || HTTPS === "true") {
  config.server.https = {
    key: HTTPS_KEY_PATH && fs.readFileSync(HTTPS_KEY_PATH),
    cert: HTTPS_CERT_PATH && fs.readFileSync(HTTPS_CERT_PATH),
  }
}

if ((typeof HTTPS === "boolean" && HTTPS) || HTTPS === "true") {
  config.server.port = APP_HTTPS_PORT
} else {
  config.server.port = APP_HTTP_PORT
}

export default defineConfig(config)
