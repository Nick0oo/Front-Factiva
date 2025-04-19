import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Agrega el dominio de la imagen externa
  },
};

export default nextConfig;
