export const metadata = {
  title: "Keranjang Belanja - CemilanCeria",
  description:
    "Kelola pesanan cireng isi ayam suwir dan produk lainnya di keranjang belanja CemilanCeria. Checkout mudah dan aman.",
  keywords: [
    "keranjang belanja cemilan",
    "checkout cireng online",
    "belanja cemilan digital",
    "pembayaran cemilan enak",
    "cart cireng isi",
  ],
  alternates: {
    canonical: "/keranjang",
  },
  openGraph: {
    title: "Keranjang Belanja CemilanCeria",
    description:
      "Langkah terakhir sebelum menikmati cireng isi ayam suwir lezat dari CemilanCeria",
    url: "https://cemilanceria.web.app/keranjang",
    siteName: "CemilanCeria",
    locale: "id_ID",
  },
};

export default function Keranjanglayout({ children }) {
  return <>{children}</>;
}
