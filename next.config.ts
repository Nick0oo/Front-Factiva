import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    domains: ["res.cloudinary.com"], // Agrega el dominio de la imagen externa
  },
};

export default nextConfig;
