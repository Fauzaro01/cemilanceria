"use client";
import { useState } from "react";
import { useCart } from "@/components/contexts/CartContext";
import Swal from "sweetalert2";
import { sendGAEvent } from "@next/third-parties/google";

export default function KeranjangPage() {
  const { cart, updateQty, removeItem } = useCart();

  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [metodeBayar, setMetodeBayar] = useState("COD");
  const [coupon, setCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");

  const handleApplyCoupon = () => {
    if (coupon === "ABC") {
      setAppliedDiscount(0.2);
      setAppliedCode("ABC");
    } else if (coupon === "123") {
      setAppliedDiscount(0.1);
      setAppliedCode("123");
    } else {
      setAppliedDiscount(0);
      setAppliedCode("");
      Swal.fire({
        title: "Kupon tidak valid",
        icon: "warning",
        text: "Harap check kembali masa berlakunya",
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  const formatterToIDR = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handleCheckout = () => {
    if (!nama || !alamat) {
      Swal.fire({
        icon: "question",
        title: "Input Perlu Di Isi",
        text: "Nama dan alamat wajib diisi!",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    const detailProduk = cart
      .map(
        (item) =>
          `- ${item.judul} (${item.qty} x Rp${item.harga}) = Rp${
            item.qty * item.harga
          }`
      )
      .join("\n");

    const message = `
        *Checkout Orderan:*

        👤 *Nama:* ${nama}
        🏠 *Alamat:* ${alamat}
        💳 *Metode Pembayaran:* ${metodeBayar}
        🏷️ *Kupon:* ${appliedCode || "-"}

        🛍️ *Detail Produk:*
        ${detailProduk}

        📦 *Subtotal:* Rp${subtotal}
        🎁 *Diskon:* Rp${discountAmount}
        💰 *Total Bayar:* Rp${total}
        `.trim();

    const encodedMessage = encodeURIComponent(message);
    const waNumber = "6285692517903";
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedMessage}`;

    sendGAEvent('event', 'checkoutClicked');

    window.open(waUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-highlight-dark">
        <i className="bi bi-cart-fill me-2"></i> Keranjang Belanja
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">
          Keranjang kamu masih kosong.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <img
                src={item.imgUrl}
                alt={item.judul}
                className="w-full sm:w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.judul}</h2>
                <p className="text-sm text-gray-600">
                  {formatterToIDR.format(item.harga)} x {item.qty}
                </p>
                <p className="text-sm text-gray-400">{item.jenisSatuan}</p>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item.id, parseInt(e.target.value))
                    }
                    className="w-20 text-center border rounded p-1"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold text-green-600">
                {formatterToIDR.format(item.harga * item.qty)}
              </div>
            </div>
          ))}

          <div className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Masukkan kode kupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="border rounded p-2 w-full sm:w-64"
              />
              <button
                onClick={handleApplyCoupon}
                className="duration-300 bg-highlight-dark text-background px-4 py-2 rounded hover:bg-highlight font-medium w-full sm:w-auto"
              >
                Terapkan Kupon
              </button>
            </div>
            {appliedCode && (
              <p className="text-sm text-green-600">
                Kupon <strong>{appliedCode}</strong> berhasil diterapkan! 🎉
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-lg font-semibold">📋 Informasi Pembeli</h2>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border rounded p-2"
            />
            <textarea
              placeholder="Alamat Lengkap"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full border rounded p-2"
              rows="3"
            />
            <select
              value={metodeBayar}
              onChange={(e) => setMetodeBayar(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="COD">Cash On Delivery (COD)</option>
            </select>
          </div>

          <div className="bg-white shadow rounded-xl p-6 text-right space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal:</span>
              <span>{formatterToIDR.format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">
                Diskon ({appliedDiscount * 100}%):
              </span>
              <span>- {formatterToIDR.format(discountAmount)}</span>
            </div>
            <div className="border-t pt-3 font-bold text-lg">
              <span>Total Bayar:</span>
              <span className="ml-4 text-green-700">
                {formatterToIDR.format(total)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              * Belum termasuk ongkir
            </p>
          </div>

          <div className="text-right">
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Bayar Sekarang via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
