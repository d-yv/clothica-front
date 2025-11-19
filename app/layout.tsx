import type { Metadata } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer/Footer";

const inter = Inter({
  subsets: ["cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["cyrillic"],
  weight: ["400"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clothica-shop",
  description: "Clothica — це місце, де комфорт поєднується зі стилем.",
  openGraph: {
    title: "Clothica-shop",
    description: "Clothica — це місце, де комфорт поєднується зі стилем.",
    images: [
      {
        url: "https://clothica-front.vercel.app/images/hero/hero-desktop.png",
        width: 1200,
        height: 630,
        alt: "Welcome to Clothica-shop",
      },
    ],
    url: "https://clothica-front.vercel.app",
  },
};

export default function RootLayout({
  children,
  modal,
}: //modal,
Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${inter.variable} ${nunito.variable} `}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>
              {children}
              {modal}
            </main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body> */}

      <body className={`${inter.variable} ${nunito.variable} `}>
        <Header />
        <main>
          {children}
          {modal}
        </main>
        <Footer />
      </body>
    </html>
  );
}
