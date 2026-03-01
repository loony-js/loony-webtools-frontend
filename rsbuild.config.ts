import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import tailwindcssPostcss from "@tailwindcss/postcss"
import autoprefixer from "autoprefixer"
import fs from "fs"

const { APP_PORT, HTTPS_KEY_PATH, HTTPS_CERT_PATH, HTTPS } = process.env

const config: any = {
  server: {
    port: (APP_PORT && parseInt(APP_PORT)) || 3000,
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

if (HTTPS === "true") {
  config.server.https = {
    key: HTTPS_KEY_PATH && fs.readFileSync(HTTPS_KEY_PATH),
    cert: HTTPS_CERT_PATH && fs.readFileSync(HTTPS_CERT_PATH),
  }
}

export default defineConfig(config)
