"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import css from "./CategoriesFilter.module.css";

import { Category, getCategories } from "@/utils/categories";

export type GoodsFilters = {
  categoryId: string | null;
  sizes: string[];
  minPrice: number;
  maxPrice: number;
  gender: string; // 'all' | 'female' | 'male' | 'other'
};

type CategoriesFilterProps = {
  onCategoryChange?: (categoryName: string | null) => void;
  onFiltersChange?: (filters: GoodsFilters) => void;
};

export default function CategoriesFilter({
  onCategoryChange,
  onFiltersChange,
}: CategoriesFilterProps) {
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(3000);
  const [gender, setGender] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const genderOptions = [
    { value: "all", label: "Всі" },
    { value: "female", label: "Жіночий" },
    { value: "male", label: "Чоловічий" },
    { value: "other", label: "Унісекс" },
  ];

  const min = 0;
  const max = 15000;

  // утилита — собрать текущие фильтры и отдать наверх
  const emitFilters = (override?: Partial<GoodsFilters>) => {
    const filters: GoodsFilters = {
      categoryId: activeCategoryId,
      sizes: selectedSizes,
      minPrice: minVal,
      maxPrice: maxVal,
      gender,
      ...override,
    };
    onFiltersChange?.(filters);
  };

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setSelectedSizes((prev) => {
      const updated = checked
        ? [...prev, name]
        : prev.filter((size) => size !== name);

      emitFilters({ sizes: updated });
      return updated;
    });
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
    emitFilters({ minPrice: value });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
    emitFilters({ maxPrice: value });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGender(value);
    emitFilters({ gender: value });
  };

  const handleClearAll = () => {
    setActiveCategoryId(null);
    setSelectedSizes([]);
    setMinVal(0);
    setMaxVal(3000);
    setGender("all");
    onCategoryChange?.(null);
    emitFilters({
      categoryId: null,
      sizes: [],
      minPrice: 0,
      maxPrice: 3000,
      gender: "all",
    });
  };

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    category: Category | null
  ) => {
    e.preventDefault();

    if (category) {
      setActiveCategoryId(category.id);
      onCategoryChange?.(category.name);
      emitFilters({ categoryId: category.id });
    } else {
      setActiveCategoryId(null);
      onCategoryChange?.(null);
      emitFilters({ categoryId: null });
    }
  };

  const renderBody = () => (
    <>
      <div className={css.box}>
        <p>Фільтри</p>
        <button type="button" onClick={handleClearAll}>
          Очистити всі
        </button>
      </div>
      {/* тут пока можно оставить заглушку, реальное число подтягивает GoodsPage при желании */}
      <p className={css.numberOfGoods}>Показано 15 з 100</p>

      <ul>
        <li className={css.categoryListItem}>
          <Link
            className={css.category}
            href="/goods"
            onClick={(e) => handleCategoryClick(e, null)}
          >
            Усі
          </Link>
        </li>
        {categories.map((category) => (
          <li className={css.categoryListItem} key={category.id}>
            <Link
              className={css.category}
              href={`/goods?category=${category.id}`}
              onClick={(e) => handleCategoryClick(e, category)}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className={css.sizesContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Розмір</p>
          <button
            type="button"
            onClick={() => {
              setSelectedSizes([]);
              emitFilters({ sizes: [] });
            }}
          >
            Очистити
          </button>
        </div>
        <div className={css.sizesBox}>
          {["xxs", "xs", "s", "m", "l", "xl", "xxl"].map((size) => (
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

      <div className={css.sliderContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Ціна</p>
          <button
            type="button"
            onClick={() => {
              setMinVal(0);
              setMaxVal(3000);
              emitFilters({ minPrice: 0, maxPrice: 3000 });
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

      <div className={css.genderContainer}>
        <div className={css.box}>
          <p className={css.containerTitle}>Стать</p>
          <button
            type="button"
            onClick={() => {
              setGender("all");
              emitFilters({ gender: "all" });
            }}
          >
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
          <p className={css.numberOfGoods}>Показано 15 з 100</p>
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
