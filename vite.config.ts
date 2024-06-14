import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { execSync } from "node:child_process"

const commitHash = execSync("git rev-parse --short HEAD", { encoding: "utf8" })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
})
