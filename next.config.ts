import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer'],
};

module.exports = {
  allowedDevOrigins: ['10.217.57.65'],
}
export default nextConfig;
