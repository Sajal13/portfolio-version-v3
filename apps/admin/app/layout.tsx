import type { Metadata } from "next";
import {inter} from './fonts';
import "@repo/ui/globals.css"
import "./index.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin Dashboard",
  },
  description:
    "Admin dashboard for managing the content, projects, blogs, media, and analytics of Sajal Das Portfolio V3.",
  applicationName: "Portfolio Admin",
  authors: [
    {
      name: "Sajal Das",
      url: "https://your-domain.com",
    },
  ],
  creator: "Sajal Das",
  keywords: [
    "Portfolio",
    "Admin Dashboard",
    "CMS",
    "Next.js",
    "NestJS",
    "TurboRepo",
    "TypeScript",
    "Tailwind CSS",
    "Portfolio V3",
  ],
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
