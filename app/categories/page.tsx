"use client";

import { useEffect, useState, useMemo } from "react";
import { getCategories, Category } from "@/utils/categories";
import CategoriesList from "@/components/common/CategoriesList/CategoriesList";
import css from "./CategoriesPage.module.css";

const LOAD_MORE_AMOUNT = 3;

export default function CategoriesPage() {
  const getInitialLimit = () => {
    if (typeof window === "undefined") return 6;
    return window.innerWidth >= 1440 ? 6 : 4;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount, setVisibleCount] = useState(getInitialLimit());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getInitialLimit());
    };

    window.addEventListener("resize", handleResize);

    (async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      }
    })();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const visibleCategories = useMemo(
    () => categories.slice(0, visibleCount),
    [categories, visibleCount]
  );

  const isExpanded = visibleCount >= categories.length;
  const canShowButton = categories.length > getInitialLimit();

  const toggleShow = () => {
    if (isExpanded) {
      setVisibleCount(getInitialLimit());
    } else {
      const next = visibleCount + LOAD_MORE_AMOUNT;
      setVisibleCount(Math.min(next, categories.length));
    }
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <h1 className={css.title}>Категорії</h1>

        <CategoriesList categories={visibleCategories} />

        {canShowButton && (
          <div className={css.showMoreContainer}>
            <button className={css.showMore} onClick={toggleShow}>
              {isExpanded ? "Показати менше" : "Показати більше"}
            </button>
          </div>
        )}

        {categories.length === 0 && <p>Завантаження категорій...</p>}
      </div>
    </section>
  );
}
