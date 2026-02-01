import { execSync } from 'child_process';
import type { NextConfig } from "next";

const getCommitSha = () => {
  try {
    return process.env.VERCEL_GIT_COMMIT_SHA || execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    return 'local-dev';
  }
};

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0', 
    NEXT_PUBLIC_COMMIT_SHA: getCommitSha(),
  },
  serverExternalPackages: ['ssh2'],
};

export default nextConfig;
