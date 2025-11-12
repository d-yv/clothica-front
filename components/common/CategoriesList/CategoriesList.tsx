"use client";

import { useRef, useState } from "react";
import { Category } from "@/utils/categories";
import CategoryCard from "../CategoryCard/CategoryCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./CategoriesList.module.css";

interface Props {
  categories: Category[];
  variant?: "slider" | "grid";
  showMoreButton?: boolean;
  onShowMore?: () => void;
  isEnd?: boolean;
}

export default function CategoriesList({
  categories,
  variant = "slider",
  showMoreButton = false,
  onShowMore,
  isEnd,
}: Props) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEndSlide, setIsEndSlide] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const visibleCategories = categories.slice(0, visibleCount);
  const handleNext = () => {
    if (visibleCount < categories.length) {
      setVisibleCount((prev) => Math.min(prev + 3, categories.length));

      setTimeout(() => {
        swiper?.slideNext();
      }, 0);
    } else {
      swiper?.slideNext();
    }
  };

  const handlePrev = () => {
    swiper?.slidePrev();
  };

  if (!categories?.length) {
    return <p className={styles.empty}>Немає категорій для відображення.</p>;
  }

  // Слайдер
  if (variant === "slider") {
    return (
      <div className={styles.wrapper}>
        <Swiper
          modules={[Navigation, Keyboard]}
          onSwiper={setSwiper}
          onSlideChange={(s) => {
            setIsBeginning(s.isBeginning);
            setIsEndSlide(s.isEnd);
            if (s.isEnd && visibleCount < categories.length) {
              setVisibleCount((prev) => Math.min(prev + 3, categories.length));
            }
          }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          simulateTouch={true}
          allowTouchMove={true}
          spaceBetween={32}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={styles.swiper}
        >
          {visibleCategories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <CategoryCard category={cat} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.allButton}>
          <button
            ref={prevRef}
            className={`${styles.navButton} ${styles.left} ${
              isBeginning ? styles.disabled : ""
            }`}
            onClick={handlePrev}
            disabled={isBeginning}
            aria-label="Попередній"
          >
            ←
          </button>

          <button
            ref={nextRef}
            className={`${styles.navButton} ${styles.right} ${
              isEndSlide ? styles.disabled : ""
            }`}
            onClick={handleNext}
            disabled={isEndSlide}
            aria-label="Наступний"
          >
            →
          </button>
        </div>
      </div>
    );
  }

  // Грід
  return (
    <div className={styles.gridWrapper}>
      <ul className={styles.grid}>
        {categories.map((cat) => (
          <li key={cat.id} className={styles.item}>
            <CategoryCard category={cat} />
          </li>
        ))}
      </ul>

      {showMoreButton && !isEnd && (
        <button type="button" className={styles.showMore} onClick={onShowMore}>
          Показати більше
        </button>
      )}
    </div>
  );
}
