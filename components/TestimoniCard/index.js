'use client';
import { Customer } from "./Customer";
const testimoniCireng = [
  {
    nama: "Siti Nur Aisyah",
    jabatan: "Ibu Rumah Tangga",
    pesan:
      "Cireng isi ayam suwir ini rasanya enak banget! Ayamnya empuk dan gurih, kulitnya juga kriuk sempurna. Cocok banget buat teman santai di waktu senggang!",
  },
  {
    nama: "Budi Santoso",
    jabatan: "Guru SMA",
    pesan:
      "Sebagai pecinta makanan ringan, saya sangat suka dengan cireng ini. Isi ayamnya berlimpah dan rasanya kaya bumbu, pas banget buat makan siang atau cemilan sore.",
  },
  {
    nama: "Rina Yuliana",
    jabatan: "Staff Admin",
    pesan:
      "Makan cireng isi ayam suwir ini rasanya bikin ketagihan! Teksturnya yang kenyal dan rasa ayam yang pas, membuat setiap gigitan semakin nikmat. Wajib dicoba deh!",
  },
];


export default function TestimoniCard() {
    return (
        <div className="bg-foreground max-w-[950px] p-[10px] rounded-[8px] flex flex-col mx-auto" id="testimoni">
          <h1 className="text-center text-highlight text-2xl md:text-3xl font-bold pb-[12px] border-b-4 border-highlight-dark">Apa Kata Mereka?</h1>
          <div className="flex flex-col gap-4 p-4 items-center">
            {testimoniCireng.map((pengguna, i) => (
                <Customer key={i} nama={pengguna.nama} jabatan={pengguna.jabatan} pesan={pengguna.pesan}/>
            ))}
          </div>
        </div>
      )
}