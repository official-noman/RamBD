import type { Metadata } from "next";
import Login from "@sections/auth/Login";

export const metadata: Metadata = {
  title: "Login - RamBD - The Best Gadgets Shop",
  description:
    "RamBD is your one-stop shop for microphones, gadgets, and electronics in Bangladesh.",
  authors: [{ name: "RamBD", url: "https://rambd.com" }],
  keywords: ["e-commerce", "gadgets", "microphones", "rambd", "bangladesh"]
};

export default function LoginPage() {
  return <Login />;
}
