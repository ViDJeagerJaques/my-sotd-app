import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://navdlgrkdfemdariuhls.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdmRsZ3JrZGZlbWRhcml1aGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODQ5OTgsImV4cCI6MjA5NTU2MDk5OH0.FAn0YbjsNoQy-6pIvaCssvKzSjXMkS6iWwfNtO2KkI4",
    NEXT_PUBLIC_SITE_URL: "https://my-sotd-app-460699291343.asia-southeast2.run.app",
  },
};

export default nextConfig;