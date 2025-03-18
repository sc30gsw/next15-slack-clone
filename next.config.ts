import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
    ppr: 'incremental',
    useCache: true,
    authInterrupts: true,
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
}

export default nextConfig
