import { useCart } from "../contexts/CartContext";
import { sendGAEvent } from "@next/third-parties/google";

export default function ProuctItem({ id, produk }) {
  const formatterToIDR = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const { addToCart } = useCart();
  return (
    <div className="bg-foreground p-2 m-2 rounded-md">
      <img
        className="w-[100%] h-[150px] md:h-[350px] object-cover rounded-lg"
        src={produk.imgUrl}
        alt={produk.judul}
      ></img>
      <div className="p-3">
        <h2 className="text-xl font-semibold text-highlight-dark mb-1">
          {produk.judul}
        </h2>
        <p className="w-[80%] font-light md:font-normal text-highlight-dark">
          {produk.deskripsi}
        </p>
        <div className="mt-2 flex justify-between">
          <span className="text-highlight font-medium">
            {formatterToIDR.format(produk.harga)}{" "}
            <span className="text-xs">/{produk.jenisSatuan}</span>
          </span>
          <button
            onClick={() => {
                    addToCart(produk)
                    sendGAEvent("event", {
                      action: "Add to Cart",
                      label: produk.name,
                    })
                  }}
            className="duration-400 border text-highlight-dark rounded-md py-[4px] px-[30px] font-medium hover:bg-highlight-dark hover:text-foreground"
          >
            Beli
          </button>
        </div>
      </div>
    </div>
  );
}
