import type { NextConfig } from "next";

const supabaseUrl = process.env.SUPABASE_URL;
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "portfolio-assets";

function supabaseImagePattern() {
  if (!supabaseUrl || /YOUR_PROJECT_REF/i.test(supabaseUrl)) return [];
  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return [];
    return [{
      protocol: url.protocol.slice(0, -1) as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: `/storage/v1/object/public/${storageBucket}/**`,
    }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86_400,
    remotePatterns: supabaseImagePattern(),
  },
};

export default nextConfig;
