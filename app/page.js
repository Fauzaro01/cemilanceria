"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import TestimoniCard from "@/components/TestimoniCard";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className=" h-[100vh] flex justify-between flex-col px-[35px] py-[20px] mb-[20px] md:flex-row gap-10">
        <div className="w-full lg:w-[50%]">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
            Jelajahi Rasanya!
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold py-5 tracking-wide text-slate-800">
            <span className="text-highlight">Cemilan Ceria</span>, Cemilan wajib
            Pelajar
          </h1>
          <p className="text-md md:text-xl text-slate-800">
            Setiap Cemilan yang kami buat terjamin kelezatannya, menggunakan
            bahan-bahan berkualitas dan resep yang sudah teruji, menjadikannya
            pilihan camilan yang sempurna untuk menemani hari Anda.
          </p>
          <div className="py-5 flex gap-5">
            <a
              href="#produk"
              className="bg-highlight-dark px-[12px] py-[8px] text-md font-semibold text-background rounded-md duration-300 hover:-translate-y-1 hover:bg-highlight"
            >
              Order Sekarang
            </a>
            <a
              href="#testimoni"
              className="bg-highlight-dark px-[12px] py-[8px] text-md font-semibold rounded-md text-background duration-300 hover:-translate-y-1 hover:bg-highlight"
            >
              Testimoni
            </a>
          </div>
        </div>
        <div className="w-75">
          <img
            src="/cirengkuh.webp"
            className="w-[250px] h-max invisible md:visible mx-auto float-animation"
            alt="preview_cireng"
          ></img>
        </div>
      </div>
      <ProductCard />
      <TestimoniCard />
      <div className="flex flex-col gap-2.5 bg-foreground rounded-[8px] my-[10px] mx-auto p-[14px] w-[80%] max-w-[950px]">
        <h1 className="text-highlight-dark font-bold text-2xl md:text-3xl pb-[8px] border-b-4 border-highlight-dark">
          Alamat Kami
        </h1>
        <iframe
          loading="lazy"
          allowFullScreen
          title="mapscemilanceria"
          referrerPolicy="no-referrer-when-downgrade"
          className="mx-auto w-[80%] h-[350px] border-[2px] border-highlight rounded-lg"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=-6.395309395236612,107.46001052468945&zoom=16&maptype=satellite"
        ></iframe>
      </div>
      <Footer />
    </>
  );
}
