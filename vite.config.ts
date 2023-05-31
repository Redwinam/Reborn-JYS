import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  experimental: {
    renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
      if (type === 'public') {
        return 'https://cdn.jys-wtf.proxy.mayq.me/' + filename
      }
      else if (path.extname(hostId) === '.js') {
        return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
      }
      else {
        return 'https://cdn.jys-wtf.proxy.mayq.me/' + filename
      }
    }
  }
})
