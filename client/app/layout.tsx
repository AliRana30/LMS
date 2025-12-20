import type { Metadata } from "next";
import { Geist, Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import { SocketProvider } from "./utils/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CampusCore",
  description: "Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${poppins.variable} ${josefinSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <SessionProviderWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SocketProvider>
                {children}
              </SocketProvider>
              <Toaster position="top-center" reverseOrder={true} />
            </ThemeProvider>
          </SessionProviderWrapper>
        </Providers>
      </body>
    </html>
  );
}