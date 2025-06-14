import { Geist_Mono, Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { CartProvider } from "@/components/contexts/CartContext";

const poppinsSans = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CemilanCeria - Toko Cemilan Enak & Sehat",
  description:
    "Toko online CemilanCeria menyediakan cireng isi ayam suwir lezat dengan bahan premium. Cemilan renyah, gurih, dan bergizi untuk keluarga. Pesan sekarang!",
  keywords: [
    "Cireng Isi Ayam Suwir",
    "Toko Cemilan Online",
    "Cemilan Sehat",
    "Snack Tradisional",
    "Cireng Renyah",
    "Makanan Ringan Enak",
    "Cemilan Rumahan",
    "Jajanan Pasar Modern",
    "Cireng Premium",
    "Cemilan Murah Berkualitas",
  ],
  authors: [{ name: "Fauzaro01", url: "https://fauzaro01.web.app" }],
  creator: "CemilanCeria",
  publisher: "CemilanCeria",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://cemilanceria.web.app"),
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
    },
  },
  openGraph: {
    title: "CemilanCeria - Cireng Isi Ayam Suwir Premium",
    description:
      "Cireng isi ayam suwir dengan racikan bumbu istimewa, digoreng fresh setiap pesanan. Cocok untuk teman ngopi atau cemilan keluarga.",
    url: "https://cemilanceria.web.app",
    siteName: "CemilanCeria",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/product1.webp",
        width: 1200,
        height: 630,
        alt: "Cireng Isi Ayam Suwir CemilanCeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CemilanCeria - Cireng Isi Ayam Suwir Premium",
    description:
      "Cemilan renyah dengan isian ayam suwir bumbu istimewa, digoreng fresh setiap pesanan.",
    images: ["/product1.webp"],
    creator: "@cemilanceeria",
  },
  verification: {
    google: "vSf9Jsb1ybtYu5fPMUtzzedrROegeQN9BJAw_RXCHHE",
    yandex: "a54044bc9d9880d2",
  },
  category: "food & beverage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${poppinsSans.className} ${geistMono.variable} antialiased m-[8px]`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
      <GoogleAnalytics gaId="G-GR0N34GDZS" />
    </html>
  );
}
