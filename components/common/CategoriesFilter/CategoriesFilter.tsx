"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import css from "./CategoriesFilter.module.css";
import { Category, getCategories } from "@/utils/categories";
import { GoodsFilters } from "@/types/goodsFilters";
import { GoodsGender } from "@/types/goodsGender";

type Props = {
  onFiltersChange?: (filters: GoodsFilters) => void;
  onCategoryChange?: (categoryName: string | null) => void;
};

const DEFAULT_FILTERS: GoodsFilters = {
  categoryId: null,
  sizes: [],
  minPrice: 0,
  maxPrice: 3000,
  gender: "all",
};

export default function CategoriesFilter({
  onFiltersChange,
  onCategoryChange,
}: Props) {
  const [filters, setFilters] = useState<GoodsFilters>(DEFAULT_FILTERS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCategories();
        if (mounted) setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const updateFilters = useCallback(
    (patch: Partial<GoodsFilters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch };

        if (!Array.isArray(next.sizes)) {
          next.sizes = next.sizes ? [String(next.sizes)] : [];
        }

        onFiltersChange?.(next);
        return next;
      });
    },
    [onFiltersChange]
  );

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    onFiltersChange?.(DEFAULT_FILTERS);
    onCategoryChange?.(null);
  };

  const handleCategoryClick = (e: React.MouseEvent, cat: Category | null) => {
    e.preventDefault();
    updateFilters({ categoryId: cat ? cat.id : null });
    onCategoryChange?.(cat ? cat.name : null);
  };

  const handleSizeToggle = (size: string, checked: boolean) => {
    const clean = size.toLowerCase();
    updateFilters({
      sizes: checked
        ? [...filters.sizes, clean]
        : filters.sizes.filter((s) => s !== clean),
    });
  };

  const handleMinChange = (v: number) => {
    updateFilters({ minPrice: Math.max(0, Math.min(v, filters.maxPrice - 1)) });
  };

  const handleMaxChange = (v: number) => {
    updateFilters({
      maxPrice: Math.min(15000, Math.max(v, filters.minPrice + 1)),
    });
  };

  const showSizeChecked = (s: string) =>
    filters.sizes.includes(s.toLowerCase());

  const genderOptions = useMemo(
    () => [
      { value: "all", label: "Всі" },
      { value: "women", label: "Жіночий" },
      { value: "man", label: "Чоловічий" },
      { value: "unisex", label: "Унісекс" },
    ],
    []
  );

  const renderBody = () => (
    <>
      <div className={css.box}>
        <p>Фільтри</p>
        <button type="button" onClick={clearAll}>
          Очистити всі
        </button>
      </div>

      <p className={css.numberOfGoods}>Показано</p>

      <ul>
        <li className={css.categoryListItem}>
          <a
            href="/goods"
            className={css.category}
            onClick={(e) => handleCategoryClick(e, null)}
          >
            Усі
          </a>
        </li>

        {categories.map((cat) => (
          <li key={cat.id} className={css.categoryListItem}>
            <a
              href={`/goods?categoryId=${cat.id}`}
              className={css.category}
              onClick={(e) => handleCategoryClick(e, cat)}
            >
              {cat.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Sizes */}
      <div className={css.sizesContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Розмір</p>
          <button type="button" onClick={() => updateFilters({ sizes: [] })}>
            Очистити
          </button>
        </div>

        <div className={css.sizesBox}>
          {["XXS", "XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                checked={showSizeChecked(size)}
                onChange={(e) => handleSizeToggle(size, e.target.checked)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className={css.sliderContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Ціна</p>
          <button
            type="button"
            onClick={() =>
              updateFilters({
                minPrice: DEFAULT_FILTERS.minPrice,
                maxPrice: DEFAULT_FILTERS.maxPrice,
              })
            }
          >
            Очистити
          </button>
        </div>

        <div className={css.priceWrapper}>
          <div className={css.slider}>
            <div
              className={css.sliderTrack}
              style={{
                background: `linear-gradient(to right,
                  #ddd ${(filters.minPrice / 15000) * 100}%,
                  #000 ${(filters.minPrice / 15000) * 100}%,
                  #000 ${(filters.maxPrice / 15000) * 100}%,
                  #ddd ${(filters.maxPrice / 15000) * 100}%)`,
              }}
            />
            <input
              type="range"
              min={0}
              max={15000}
              value={filters.minPrice}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className={`${css.thumb} ${css.thumbLeft}`}
            />
            <input
              type="range"
              min={0}
              max={15000}
              value={filters.maxPrice}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className={`${css.thumb} ${css.thumbRight}`}
            />
          </div>

          <div className={css.sliderValues}>
            <span>{filters.minPrice}</span>
            <span>{filters.maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Gender */}
      <div className={css.genderContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Стать</p>
          <button
            type="button"
            onClick={() => updateFilters({ gender: "all" })}
          >
            Очистити
          </button>
        </div>

        <div className={css.radiosBox}>
          {genderOptions.map((opt) => (
            <label key={opt.value} className={css.radio}>
              <input
                type="radio"
                name="gender"
                value={opt.value}
                checked={filters.gender === opt.value}
                onChange={(e) =>
                  updateFilters({ gender: e.target.value as GoodsGender })
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  // -------------------------------
  // Layout
  // -------------------------------
  return (
    <div className={css.sideBar}>
      {isMobile ? (
        <div className={css.sideBarMobile}>
          <div className={css.box}>
            <p>Фільтри</p>
            <button type="button" onClick={clearAll}>
              Очистити всі
            </button>
          </div>

          <button
            className={css.dropdownButton}
            onClick={() => setOpen((s) => !s)}
          >
            Фільтри
            <svg
              className={open ? css.arrowUp : css.arrowDown}
              width={24}
              height={24}
            >
              <use href="/symbol-defs.svg#icon-keyboard_arrow_down"></use>
            </svg>
          </button>

          {open && <div className={css.dropdownContent}>{renderBody()}</div>}
        </div>
      ) : (
        <div className={css.sideBarDescktop}>{renderBody()}</div>
      )}
    </div>
  );
}
