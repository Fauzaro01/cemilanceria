'use client';
import Link from "next/link";

export default function Navbar() {
    return <div className="sticky top-0 left-0 right-0 bottom-0 h-[60px] bg-foreground rounded-[10px] flex justify-between items-center px-[10px] py-[2px] mb-[10px] z-10">
        <h2 className="font-bold text-highlight text-lg">Cemilan Ceria</h2>
        <div className="flex justify-center gap-[10px] ">
            <Link className="rounded-md p-[6px] transition transform duration-300 text-highlight-dark hover:bg-foreground-hover" aria-label="Halaman Depan" href="/">Home</Link>
            <Link className="rounded-md p-[6px] transition transform duration-300 text-highlight-dark hover:bg-foreground-hover" href="#produk">Produk</Link>
            <Link className="rounded-md p-[6px] transition transform duration-300 text-highlight-dark hover:bg-foreground-hover mx-2" aria-label="Keranjang" href="/keranjang"><i className="bi bi-cart-fill"></i></Link>
        </div>
    </div>
}