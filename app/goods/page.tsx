"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { GoodsFilters } from "@/types/goodsFilters";
import CategoriesFilter from "@/components/common/CategoriesFilter/CategoriesFilter";
import GoodsList from "@/components/common/GoodsList/GoodsList";

import styles from "./GoodsPage.module.css";

const DESKTOP_PER_PAGE = 12;
const MOBILE_TABLET_PER_PAGE = 8;

const getInitialPerPage = () => {
  if (typeof window === "undefined") return DESKTOP_PER_PAGE;
  return window.innerWidth >= 1440 ? DESKTOP_PER_PAGE : MOBILE_TABLET_PER_PAGE;
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

  const [page, setPage] = useState<number>(1);

  const [perPage, setPerPage] = useState<number>(() => getInitialPerPage());

  const [shownCount, setShownCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const title = activeCategoryName ?? "Всі товари";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const next = getInitialPerPage();

      setPerPage((prev) => (page === 1 ? next : prev));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [page]);

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("perPage", String(perPage));

    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.sizes.length) {
      params.set("size", filters.sizes.join(","));
    }
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters.gender !== "all") params.set("gender", filters.gender);

    router.replace(`/goods?${params.toString()}`, { scroll: false });
  }, [filters, page, perPage, router]);

  const handleFiltersChange = useCallback((next: GoodsFilters) => {
    setFilters(next);
    setPage(1);
    setShownCount(0);
    setTotalCount(0);
    setHasMore(true);
    setPerPage(getInitialPerPage());
  }, []);

  const handleShowMore = () => {
    if (!hasMore) return;
    setPage((prev) => prev + 1);
  };

  const handleMetaChange = useCallback(
    (meta: { hasMore: boolean; shownCount: number; totalCount: number }) => {
      setHasMore(meta.hasMore);
      setShownCount(meta.shownCount);
      setTotalCount(meta.totalCount);
    },
    []
  );

  return (
    <main className="style">
      <div className="container">
        <h1 className={`${title} ${styles.goodsPageTitle}`}>{title}</h1>

        <section className={styles.content}>
          <aside className={styles.sidebar}>
            <CategoriesFilter
              onCategoryChange={setActiveCategoryName}
              onFiltersChange={handleFiltersChange}
              shownCount={shownCount}
              totalCount={totalCount}
            />
          </aside>

          <div className={styles.listArea}>
            <GoodsList
              page={page}
              perPage={perPage}
              filters={filters}
              onMetaChange={handleMetaChange}
            />

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
