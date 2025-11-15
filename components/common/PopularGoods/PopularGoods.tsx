"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { api } from "@/app/api/api";
import { Good } from "@/types/good";
import GoodCard from "../GoodCard/GoodCard";
import styles from "./PopularGoods.module.css";

export default function PopularGoods() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const swiperRef = useRef<SwiperType | null>(null);

  const MAX_ITEMS = 10;

  useEffect(() => {
    const loadGoods = async () => {
      try {
        const res = await api.get("/goods");
        const list: Good[] = (res.data.goods || res.data || []).slice(0, MAX_ITEMS);
        setGoods(list);
      } catch {
        setError("Не вдалося завантажити популярні товари");
      } finally {
        setLoading(false);
      }
    };
    loadGoods();
  }, []);

  const handleNextClick = () => swiperRef.current?.slideNext();
  const handlePrevClick = () => swiperRef.current?.slidePrev();

  if (loading)
    return (
      <section className={styles.section}>
        <div className="container"><p className={styles.loading}>Завантаження...</p></div>
      </section>
    );

  if (error)
    return (
      <section className={styles.section}>
        <div className="container"><p className={styles.error}>{error}</p></div>
      </section>
    );

  if (!goods.length) return null;

  return (
    <section className={styles.section} id="populargoods">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Популярні товари</h2>

          <Link href="/goods" className={styles.allButton}>
            Всі товари
          </Link>
        </div>

        <div className={styles.sliderWrapper}>
          <Swiper
            modules={[Keyboard, Pagination, Navigation]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
            spaceBetween={32}
            keyboard={{ enabled: true }}
            pagination={{
              clickable: true,
              el: `.${styles.pagination}`,
              bulletClass: styles.bullet,
              bulletActiveClass: styles.bulletActive,
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1440: { slidesPerView: 4 },
            }}
            className={styles.swiper}
          >
            {goods.map((good) => (
              <SwiperSlide key={good._id} className={styles.slide}>
                <GoodCard good={good} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.pagination} />

            <div className={styles.arrows}>
              <button
                type="button"
                className={`${styles.arrow} ${styles.prev}`}
                onClick={handlePrevClick}
              >
                ←
              </button>

              <button
                type="button"
                className={`${styles.arrow} ${styles.next}`}
                onClick={handleNextClick}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}