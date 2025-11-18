"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { GoodsFilters } from "@/types/goodsFilters";
import CategoriesFilter from "@/components/common/CategoriesFilter/CategoriesFilter";
import GoodsList from "@/components/common/GoodsList/GoodsList";

import styles from "./GoodsPage.module.css";

const MOBILE_TABLET_COUNT = 8;
const DESKTOP_COUNT = 12;
const LOAD_STEP = 3;

const getInitialPerPage = () => {
  if (typeof window === "undefined") return DESKTOP_COUNT;
  return window.innerWidth >= 1440 ? DESKTOP_COUNT : MOBILE_TABLET_COUNT;
};

export default function GoodsPage() {
  const router = useRouter();

  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(
    null
  );

  const [filters, setFilters] = useState<GoodsFilters>({
    categoryId: null,
    sizes: [],
    minPrice: 0,
    maxPrice: 3000,
    gender: "all",
  });

  const [perPage, setPerPage] = useState<number>(() => getInitialPerPage());
  const [hasMore, setHasMore] = useState(true);

  const title = activeCategoryName ?? "Всі товари";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ hasMore: boolean }>;
      setHasMore(custom.detail.hasMore);
    };

    window.addEventListener("goods-meta", handler as EventListener);
    return () =>
      window.removeEventListener("goods-meta", handler as EventListener);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", "1");
    params.set("perPage", String(perPage));

    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.sizes.length) {
      // бек принимает size
      params.set("size", filters.sizes.join(","));
    }
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters.gender !== "all") params.set("gender", filters.gender);

    router.replace(`/goods?${params.toString()}`, { scroll: false });
  }, [filters, perPage, router]);

  const handleFiltersChange = useCallback((next: GoodsFilters) => {
    setFilters(next);
    setPerPage(getInitialPerPage());
  }, []);

  const handleShowMore = () => {
    if (!hasMore) return;
    setPerPage((prev) => prev + LOAD_STEP);
  };

  return (
    <main className="style">
      <div className="container">
        <h1 className={`title ${styles.goodsPageTitle}`}>{title}</h1>

        <section className={styles.content}>
          <aside className={styles.sidebar}>
            <CategoriesFilter
              onCategoryChange={setActiveCategoryName}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          <div className={styles.listArea}>
            <GoodsList />

            {hasMore && (
              <div className={styles.showMoreWrapper}>
                <button
                  type="button"
                  className={styles.showMoreBtn}
                  onClick={handleShowMore}
                >
                  Показати більше
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
