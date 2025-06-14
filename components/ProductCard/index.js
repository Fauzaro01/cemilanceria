"use client";
import ProuctItem from "./ProductItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const productList = [
  {
    id: 1,
    judul: "Cireng Pedas - Rasa yang Menggoda!",
    harga: 3000,
    jenisSatuan: "Pcs",
    deskripsi:
      "Nikmati kelezatan Cireng Isi Ayam Suwir yang tak hanya renyah diluar, tetapi juga lezat di dalam. Setiap gigitan menyajikan sensasi crispy yang menggugah selera.",
    imgUrl: "/product1.webp",
  },
  {
    id: 2,
    judul: "Keripik Pisang Holeng - Sensasi Manis dunia!",
    harga: 5000,
    jenisSatuan: "Pcs (120g)",
    deskripsi:
      "Nikmati Keripik Pisang yang tak ada duanya, keriuk serta lumernya toping. Setiap gigitan yang membuat mu ketagihan!",
    imgUrl: "/product2.webp",
  },
  {
    id: 3,
    judul: "Basreng Pedas - Huh hah pedas!",
    harga: 5000,
    jenisSatuan: "Pcs (150g)",
    deskripsi:
      "Olahan basreng dengan daun jeruk. Teksturnya renyah dengan rasa pedas dan daun jeruk, menjadi pilihan favorit camilan pedas yang nikmat.",
    imgUrl: "/product3.webp",
  },
];

export default function ProductCard() {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1500 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 1500, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  return (
    <div
      className="w-[90%] h-[100vh] max-h-[100vh] max-w-[950px] p-[10px] my-5 rounded-[8px] flex flex-col mx-auto"
      id="produk"
    >
      <h1 className="text-highlight text-2xl md:text-3xl font-bold pb-[15px] border-b-4 border-highlight-dark ">
        Produk Kami
      </h1>
      <div className="p-4">
        <Carousel
          responsive={responsive}
          autoPlay={true}
          autoPlaySpeed={2000}
          infinite={true}
          className="pb-5 z-0"
        >
          {productList.map((produk, id) => (
            <ProuctItem key={id} id={id} produk={produk} />
          ))}
        </Carousel>
      </div>
    </div>
  );
}
