"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { api } from "@/app/api/api";
import { Good } from "@/types/good";
import GoodCard from "../GoodCard/GoodCard";
import styles from "./GoodsList.module.css";

const BACKEND_PER_PAGE = 12; // безопасный лимит для бека

export default function GoodsList() {
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString(); // чтобы эффект зависел от строки

  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        // сколько товаров хотим показать на фронте
        const uiPerPage = Number(
          searchParams.get("perPage") || BACKEND_PER_PAGE
        );

        const page = 1; // "Показати більше" у нас только раскрывает, а не листает страницы

        const minPriceStr = searchParams.get("minPrice");
        const maxPriceStr = searchParams.get("maxPrice");
        const genderStr = searchParams.get("gender");
        const categoryIdStr = searchParams.get("categoryId");
        const sizeStr = searchParams.get("size");

        const params: Record<string, unknown> = {
          page,
          perPage: BACKEND_PER_PAGE, // всегда 12 — бек не ругается
        };

        if (minPriceStr) params.minPrice = Number(minPriceStr);
        if (maxPriceStr) params.maxPrice = Number(maxPriceStr);
        if (genderStr && genderStr !== "all") params.gender = genderStr;
        if (categoryIdStr && categoryIdStr !== "null") {
          params.categoryId = categoryIdStr;
        }
        if (sizeStr) {
          // бек принимает size
          params.size = sizeStr;
        }

        console.log("Fetching goods with params:", params);

        const res = await api.get("/goods", { params });

        console.log("Fetched goods response:", res.data);
        const data = res.data;

        const list: Good[] = data.goods || [];
        setGoods(list);
        setError(null);

        // сколько реально отрисуем
        const visibleCount = Math.min(uiPerPage, list.length);
        const hasMore = visibleCount < list.length;

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("goods-meta", { detail: { hasMore } })
          );
        }
      } catch (e) {
        console.error("Fetch goods error:", e);
        setError("Не вдалося завантажити товари");

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("goods-meta", { detail: { hasMore: false } })
          );
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsString]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  // сколько показывать исходя из текущего perPage в query
  const searchParamsObj = new URLSearchParams(paramsString);
  const uiPerPage = Number(searchParamsObj.get("perPage") || BACKEND_PER_PAGE);
  const visibleGoods = goods.slice(0, uiPerPage);

  return (
    <div className={styles.list}>
      {visibleGoods.map((good) => (
        <GoodCard key={good._id} good={good} />
      ))}
    </div>
  );
}
