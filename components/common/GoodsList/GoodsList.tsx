"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/api/api";
import { Good } from "@/types/good";
import GoodCard from "../GoodCard/GoodCard";
import styles from "./GoodsList.module.css";

export default function GoodsList() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const res = await api.get("/goods");
        setGoods(res.data.goods || []);
      } catch {
        setError("Не вдалося завантажити товари");
      } finally {
        setLoading(false);
      }
    };

    fetchGoods();
  }, []);

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
