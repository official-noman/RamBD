import type { Metadata } from "next";
import Signup from "@sections/auth/Signup";

export const metadata: Metadata = {
  title: "Register - RamBD - The Best Gadgets Shop",
  description:
    "RamBD is your one-stop shop for microphones, gadgets, and electronics in Bangladesh.",
  authors: [{ name: "RamBD", url: "https://rambd.com" }],
  keywords: ["e-commerce", "gadgets", "microphones", "rambd", "bangladesh"]
};

export default function SignUpPage() {
  return <Signup />;
}
