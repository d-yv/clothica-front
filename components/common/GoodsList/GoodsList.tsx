"use client";

import { useEffect, useState } from "react";

import { api } from "@/app/api/api";
import { Good } from "@/types/good";
import { GoodsFilters } from "@/types/goodsFilters";

import GoodCard from "../GoodCard/GoodCard";
import MessageNoInfo from "@/components/common/MessageNoInfo/MessageNoInfo";

import styles from "./GoodsList.module.css";

type Props = {
  page: number;
  perPage: number;
  filters: GoodsFilters;
  onMetaChange?: (meta: {
    hasMore: boolean;
    shownCount: number;
    totalCount: number;
  }) => void;
};

export default function GoodsList({
  page,
  perPage,
  filters,
  onMetaChange,
}: Props) {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      if (page === 1) {
        setGoods([]);
      }

      try {
        const params: Record<string, unknown> = {
          page,
          perPage,
        };

        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.gender !== "all") params.gender = filters.gender;
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.sizes.length) params.size = filters.sizes;
        console.log("params", params);
        const res = await api.get("/goods", { params });
        const data = res.data;

        const pageGoods: Good[] = data.goods || [];

        setGoods((prev) => {
          const merged = page === 1 ? pageGoods : [...prev, ...pageGoods];
          const shownCount = merged.length;

          let totalCount = Number(
            data.totalGoods ??
              data.total ??
              data.totalCount ??
              data.totalItems ??
              0
          );

          if (!Number.isFinite(totalCount) || totalCount <= 0) {
            const totalPages = Number(data.totalPages);

            if (Number.isFinite(totalPages) && totalPages > 0) {
              totalCount = totalPages * perPage;

              if (page === totalPages) {
                const before = (totalPages - 1) * perPage;
                totalCount = before + pageGoods.length;
              }
            } else {
              totalCount = shownCount;
            }
          }

          const totalPages = Number(data.totalPages);
          let hasMore = false;

          if (Number.isFinite(totalPages) && totalPages > 0) {
            hasMore = page < totalPages;
          } else {
            hasMore = pageGoods.length === perPage;
          }

          onMetaChange?.({ hasMore, shownCount, totalCount });

          return merged;
        });

        setError(null);
      } catch (e) {
        console.error("Fetch goods error:", e);
        setError("Не вдалося завантажити товари");
        onMetaChange?.({ hasMore: false, shownCount: 0, totalCount: 0 });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, perPage, filters, onMetaChange]);

  if (!loading && goods.length === 0) {
    return (
      <MessageNoInfo
        text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх"
        buttonText="Скинути фільтри"
        route="/goods"
      />
    );
  }

  if (loading && goods.length === 0) return <p>Завантаження...</p>;
  if (error && goods.length === 0) return <p>{error}</p>;

  return (
    <div className={styles.list}>
      {goods.map((good) => (
        <GoodCard key={good._id} good={good} />
      ))}

      {loading && goods.length > 0 && <p>Завантаження...</p>}
    </div>
  );
}
