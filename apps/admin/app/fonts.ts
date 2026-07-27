import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "./fonts/Inter-VariableFont_opsz,wght.ttf",
      style: "normal"
    },
    {
      path: "./fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic"
    }
  ],
  variable: "--font-inter",
  display: "swap"
});
