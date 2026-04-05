import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for video uploads (100MB)
  // Note: This works for self-hosted deployments (Docker, EC2, etc.)
  // For Vercel/serverless, the limit is 4.5-6MB and cannot be changed
  // In that case, use direct-to-storage uploads (S3, etc.)
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  
  // Also configure the body parser limit via environment
  // This is handled in the API route itself for App Router
};

export default nextConfig;
