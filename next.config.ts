import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fija la raíz de Turbopack a este proyecto (hay un lockfile padre en ~/Developer).
  turbopack: {
    root: __dirname,
  },
  // Activa el MCP server en /_next/mcp (Next.js 16+)
  experimental: {
    mcpServer: true,
  },
}

export default nextConfig
