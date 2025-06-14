"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);

      if (found) {
        if (found.qty >= 30) {
          Swal.fire({
            title: "Gagal Menambahkan Keranjang!",
            text: "Produk yang kamu pilih sepertinya melebihi batas pembelian",
            icon: 'error',
            timerProgressBar: true,
            timer: 3000
          })
          return prev;
        }

        Swal.fire({
          title: "Produk Berhasil Masuk Keranjang!",
          text: `Produk yang kamu pilih telah ditambahkan ke keranjang.`,
          icon: "success",
          confirmButtonText: "Lanjut Belanja",
          showCloseButton: true,
          position: "center",
          timerProgressBar: true,
          timer: 3000,
        });
        
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
      );
      }

      Swal.fire({
        title: "Produk Berhasil Masuk Keranjang!",
        text: `Produk yang kamu pilih telah ditambahkan ke keranjang.`,
        icon: "success",
        confirmButtonText: "Lanjut Belanja",
        showCloseButton: true,
        position: "center",
        timerProgressBar: true,
        timer: 3000,
      });

      return [...prev, { ...product, qty: 1 }];
    });
  };


  const updateQty = (id, qty) => {
    if (qty === "" || isNaN(qty)) {
      qty = 1;
    }

    if (qty < 1 || qty > 30) {
      Swal.fire({
        title: "Error!",
        text: "Jumlah produk harus antara 1 sampai 30.",
        icon: "error",
        confirmButtonText: "OK",
        position: "center",
      });
      return;
    }

    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
