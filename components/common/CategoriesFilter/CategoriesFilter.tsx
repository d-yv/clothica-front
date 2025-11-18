"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import css from "./CategoriesFilter.module.css";

import { Category, getCategories } from "@/utils/categories";
import { GoodsFilters } from "@/types/goodsFilters";
import { GoodsGender } from "@/types/goodsGender";

type Props = {
  onFiltersChange?: (filters: GoodsFilters) => void;
  onCategoryChange?: (categoryName: string | null) => void;
  shownCount?: number;
  totalCount?: number;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 3000;

export default function CategoriesFilter({
  onFiltersChange,
  onCategoryChange,
  shownCount,
  totalCount,
}: Props) {
  const [minVal, setMinVal] = useState<number>(DEFAULT_MIN);
  const [maxVal, setMaxVal] = useState<number>(DEFAULT_MAX);
  const [gender, setGender] = useState<GoodsGender>("all" as GoodsGender);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

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

  // mobile / desktop
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const filters: GoodsFilters = {
      categoryId: activeCategoryId,
      sizes: selectedSizes,
      minPrice: minVal,
      maxPrice: maxVal,
      gender,
    };
    onFiltersChange?.(filters);
  }, [
    activeCategoryId,
    selectedSizes,
    minVal,
    maxVal,
    gender,
    onFiltersChange,
  ]);

  const genderOptions = useMemo(
    () => [
      { value: "all", label: "Всі" },
      { value: "women", label: "Жіночий" },
      { value: "man", label: "Чоловічий" },
      { value: "unisex", label: "Унісекс" },
    ],
    []
  );

  const min = 0;
  const max = 15000;

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const size = name.toUpperCase();

    setSelectedSizes((prev) =>
      checked ? [...prev, size] : prev.filter((s) => s !== size)
    );
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value as GoodsGender);
  };

  const handleClearAll = () => {
    setActiveCategoryId(null);
    setSelectedSizes([]);
    setMinVal(DEFAULT_MIN);
    setMaxVal(DEFAULT_MAX);
    setGender("all" as GoodsGender);
    onCategoryChange?.(null);
  };

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLAnchorElement>,
    category: Category | null
  ) => {
    e.preventDefault();

    if (category) {
      setActiveCategoryId(category.id);
      onCategoryChange?.(category.name);
    } else {
      setActiveCategoryId(null);
      onCategoryChange?.(null);
    }
  };

  const countText =
    typeof shownCount === "number" &&
    typeof totalCount === "number" &&
    totalCount > 0
      ? `Показано ${shownCount} з ${totalCount}`
      : "Показано 0 з 0";

  const renderBody = () => (
    <>
      <div className={css.box}>
        <p>Фільтри</p>
        <button type="button" onClick={handleClearAll}>
          Очистити всі
        </button>
      </div>

      <p className={css.numberOfGoods}>{countText}</p>

      <ul>
        <li className={css.categoryListItem}>
          <Link
            href="/goods"
            className={css.category}
            onClick={(e) => handleCategoryClick(e, null)}
          >
            Усі
          </Link>
        </li>
        {categories.map((category) => (
          <li className={css.categoryListItem} key={category.id}>
            <Link
              href={`/goods?categoryId=${category.id}`}
              className={css.category}
              onClick={(e) => handleCategoryClick(e, category)}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Розмір */}
      <div className={css.sizesContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Розмір</p>
          <button
            type="button"
            onClick={() => {
              setSelectedSizes([]);
            }}
          >
            Очистити
          </button>
        </div>
        <div className={css.sizesBox}>
          {["XXS", "XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                name={size}
                checked={selectedSizes.includes(size)}
                onChange={handleSizeChange}
              />
              {size.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Ціна */}
      <div className={css.sliderContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Ціна</p>
          <button
            type="button"
            onClick={() => {
              setMinVal(DEFAULT_MIN);
              setMaxVal(DEFAULT_MAX);
            }}
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
                  #ddd ${((minVal - min) / (max - min)) * 100}%, 
                  #000 ${((minVal - min) / (max - min)) * 100}%, 
                  #000 ${((maxVal - min) / (max - min)) * 100}%, 
                  #ddd ${((maxVal - min) / (max - min)) * 100}%)`,
              }}
            />
            <input
              type="range"
              min={min}
              max={max}
              value={minVal}
              onChange={handleMinChange}
              className={`${css.thumb} ${css.thumbLeft}`}
            />
            <input
              type="range"
              min={min}
              max={max}
              value={maxVal}
              onChange={handleMaxChange}
              className={`${css.thumb} ${css.thumbRight}`}
            />
          </div>
          <div className={css.sliderValues}>
            <span>{minVal}</span>
            <span>{maxVal}</span>
          </div>
        </div>
      </div>

      {/* Стать */}
      <div className={css.genderContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Стать</p>
          <button type="button" onClick={() => setGender("all" as GoodsGender)}>
            Очистити
          </button>
        </div>

        <div className={css.radiosBox}>
          {genderOptions.map((option) => (
            <label key={option.value} className={css.radio}>
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={gender === option.value}
                onChange={handleGenderChange}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className={css.sideBar}>
      {isMobile ? (
        <div className={css.sideBarMobile}>
          <div className={css.box}>
            <p>Фільтри</p>
            <button type="button" onClick={handleClearAll}>
              Очистити всі
            </button>
          </div>
          <p className={css.numberOfGoods}>
            Показано {shownCount ?? 0} з {totalCount ?? 0}
          </p>
          <button className={css.dropdownButton} onClick={toggleDropdown}>
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
