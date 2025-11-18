"use client";

import GoodsOrderList from "@/components/common/GoodsOrderList/GoodsOrderList";



export default function DevCartPage() {
  return (
    <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>Кошик (dev)</h1>
      <GoodsOrderList />
    </main>
  );
}
