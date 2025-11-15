"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/api/api";
import { Good } from "@/types/good";
import GoodCard from "../GoodCard/GoodCard";
import styles from "./GoodsList.module.css";
import { useSearchParams } from "next/navigation";

export default function GoodsList() {
  const searchParams = useSearchParams();

  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoods = async () => {
    try {
      const params = {
        page: Number(searchParams.get("page") || 1),
        perPage: Number(searchParams.get("perPage") || 12),
        minPrice: Number(searchParams.get("minPrice") || 0),
        maxPrice: Number(searchParams.get("maxPrice") || 3000),
        sizes: searchParams.get("sizes")
          ? searchParams.get("sizes")!.split(",")
          : [],
        gender: searchParams.get("gender") || "all",
        categoryId: searchParams.get("categoryId") || "",
      };

      const res = await api.get("/goods", { params });
      setGoods(res.data.goods || []);
    } catch (e) {
      console.error("Fetch goods error:", e);
      setError("Не вдалося завантажити товари");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchGoods();
  }, [searchParams]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.list}>
      {goods.map((good) => (
        <GoodCard key={good._id} good={good} />
      ))}
    </div>
  );
}
