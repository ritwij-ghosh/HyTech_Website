/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hytechracing.gatech.edu",
        pathname: "/images/**"
      }
    ]
  }
};

export default nextConfig;
