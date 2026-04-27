import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
// THEME PROVIDER
import StyledComponentsRegistry from "@lib/registry";
// APP PROVIDER
import { AppProvider } from "@context/app-context";
import StyledContext from "@context/StyledContext";
// THIRD PARTY CSS FILE
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NProgressBar from "@component/NProgress";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://rambd.com"),
  title: "RamBD - The Best Gadgets Shop in Bangladesh",
  description:
    "RamBD is your one-stop shop for microphones, gadgets, and electronics in Bangladesh. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "RamBD", url: "https://rambd.com" }],
  keywords: ["e-commerce", "gadgets", "microphones", "rambd", "bangladesh"],
  icons: {
    icon: "/assets/images/rambd_logo.webp",
    apple: "/assets/images/rambd_logo.webp",
  },
};

import AutoRefresh from "@component/AutoRefresh";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
      </head>
      <body className={openSans.className} suppressHydrationWarning>
        <StyledComponentsRegistry>
          <AppProvider>
            <StyledContext>
              <AutoRefresh />
              {children}
              <NProgressBar />
            </StyledContext>
          </AppProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
