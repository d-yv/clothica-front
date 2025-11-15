"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories, Category } from "@/utils/categories";
import CategoryCard from "../CategoryCard/CategoryCard";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import css from "./PopularCategories.module.css";

export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      }
    })();
  }, []);

  const handleNext = () => swiper?.slideNext();

  const handlePrev = () => {
    swiper?.slidePrev();
  };

  return (
    <section id="PopularCategories" className={css.section}>
      <div className={css.container}>
        <div className={css.header}>
          <h2 className={css.title}>Популярні категорії</h2>
          <div className={css.button}>
            <Link href="/categories" className={css.link}>
              Всі категорії
            </Link>
          </div>
        </div>

        <div className={css.wrapper}>
          <Swiper
            modules={[Navigation, Keyboard, A11y]}
            onSwiper={setSwiper}
            onSlideChange={(s) => {
              setIsBeginning(s.isBeginning);
              setIsEnd(s.isEnd);
            }}
            keyboard={{ enabled: true, onlyInViewport: true }}
            a11y={{ enabled: true }}
            simulateTouch={true}
            allowTouchMove={true}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className={css.swiper}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <CategoryCard category={cat} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={css.allButton}>
            <button
              className={`${css.navButton}  ${isBeginning ? css.disabled : ""}`}
              onClick={handlePrev}
              disabled={isBeginning}
              aria-label="Попередній"
            >
              <svg
                className={css.icon}
                width="24"
                height="24"
                aria-hidden="true"
              >
                <use href="/styles.icon.svg#icon-arrow-light" />
              </svg>
            </button>

            <button
              className={`${css.navButton}  ${isEnd ? css.disabled : ""}`}
              onClick={handleNext}
              disabled={isEnd}
              aria-label="Наступний"
            >
              <svg
                className={css.icon}
                width="24"
                height="24"
                aria-hidden="true"
              >
                <use href="/styles.icon.svg#icon-arrow-right" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
