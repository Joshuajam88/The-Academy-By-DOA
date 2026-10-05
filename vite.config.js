import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: process.env.GITHUB_ACTIONS === 'true' ? '/The-Academy-By-DOA/' : '/',
    server: {
        port: 5000
    },
    build: {
        chunkSizeWarningLimit: 1000
    }
})
