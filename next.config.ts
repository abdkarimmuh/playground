import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The Go sandbox fetches this from inside a sandboxed srcDoc iframe
        // (opaque "null" origin, by design — see code-playground.tsx), so
        // without an explicit Access-Control-Allow-Origin the browser's CORS
        // check blocks the response and the fetch throws "Failed to fetch".
        source: "/wasm/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }]
      }
    ];
  }
};

export default nextConfig;
