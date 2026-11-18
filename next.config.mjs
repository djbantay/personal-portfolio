import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // like elaineyu.design/?recruiter=true: a shareable link straight into recruiter mode
  async redirects() {
    return [{ source: "/", has: [{ type: "query", key: "recruiter" }], destination: "/recruiter", permanent: false }];
  },
};

export default createMDX({})(nextConfig);
