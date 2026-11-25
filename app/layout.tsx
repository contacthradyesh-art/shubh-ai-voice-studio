import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shubh AI Voice Studio",
  description: "Personal Hindi AI voice studio for natural speech and consent-based voice cloning."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hi"><body>{children}</body></html>;
}