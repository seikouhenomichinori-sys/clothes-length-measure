import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages(プロジェクトページ)は https://<user>.github.io/<repo>/ 配下で
// 配信されるため、ビルド時のみ base をリポジトリ名に合わせる
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/clothes-length-measure/' : '/',
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.app.github.dev'],
  },
}))
