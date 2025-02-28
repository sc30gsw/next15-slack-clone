import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
    ppr: 'incremental',
    useCache: true,
  },
}

export default nextConfig
