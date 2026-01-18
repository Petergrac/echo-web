import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import LeftBar from "@/components/layout/LeftBarContent";
import RightBar from "@/components/layout/RightBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import { NotificationPermission } from "@/components/websocket/WebsocketInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echo Application | Home",
  description: "Join million users and enjoy other people's posts and stories and share your own.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/echoIcon.png" />
      <body
        className={`${geistSans.variable} w-full sm:max-w-[900px] mx-auto flex justify-center h-screen overflow-hidden ${geistMono.variable} antialiased`}
      >
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <NotificationPermission />
              <SidebarProvider>
                <div className="sm:hidden">
                  <Sidebar />
                </div>
                <div className="hidden sm:block">
                  <LeftBar />
                </div>

                <main className="w-full sm:min-w-150 h-screen overflow-y-auto">
                  {children}
                </main>
                <RightBar />
              </SidebarProvider>
              <Toaster position="top-center" richColors={true} />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
