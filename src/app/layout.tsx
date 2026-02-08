import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Project Dashboard | Manage Your Projects",
  description: "A modern project management dashboard for teams to manage projects, tasks, timelines, and collaborate effectively.",
  keywords: ["project management", "dashboard", "tasks", "timeline", "team collaboration"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
