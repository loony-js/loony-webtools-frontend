import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import tailwindcssPostcss from "@tailwindcss/postcss"
import autoprefixer from "autoprefixer"
import * as envs from "./envs"

const config: any = {
  server: {
    port: 2001,
    strictPort: true,
  },
  source: {
    define: {
      "process.env": JSON.stringify(envs),
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

if (envs.NODE_ENV === "production") {
  config.server.https = envs.CERTS
}

config.server.port = envs.PORT
export default defineConfig(config)
