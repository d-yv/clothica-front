"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./GoodInfo.module.css";

// 🔗 URL бекенду
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://clothica-back.onrender.com";

// ⚙️ axios клієнт
export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
});

// 🔤 Тип товару — згідно з реальною структурою
export interface Good {
  _id: string;
  name: string;
  category?: string;
  image?: string;
  price?: {
    value: number;
    currency: string;
  };
  feedbacks?: string[];
  likes?: number;
}

// 📦 Отримати всі товари (масив гарантовано)
export const getGoods = async (): Promise<Good[]> => {
  try {
    const res = await api.get("/goods");
    const data = res.data;

    if (Array.isArray(data)) return data as Good[];
    if (data && typeof data === "object" && Array.isArray(data.goods))
      return data.goods as Good[];

    console.warn("⚠️ Неочікуваний формат відповіді бекенду:", data);
    return [];
  } catch (err) {
    console.error("❌ Помилка при запиті товарів:", err);
    return [];
  }
};

export const GoodInfo: React.FC = () => {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  // 🧠 завантаження товарів
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getGoods();
        if (!mounted) return;

        const goodsArray = Array.isArray(data) ? data : [];

        // максимум 10 товарів
        let goodsToShow = goodsArray.slice(0, 10);
        while (goodsToShow.length < 10 && goodsArray.length > 0) {
          const toAdd = 10 - goodsToShow.length;
          goodsToShow = [...goodsToShow, ...goodsArray.slice(0, toAdd)];
        }

        setGoods(goodsToShow);
      } catch (err) {
        if (!mounted) return;
        const message =
          err instanceof Error ? err.message : "Помилка завантаження";
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleNext = () => swiper?.slideNext();
  const handlePrev = () => swiper?.slidePrev();

  if (loading) return <p className={styles.loading}>Завантаження...</p>;
  if (error) return <p className={styles.error}>Помилка: {error}</p>;

  return (
    <section className={styles.section} aria-label="Інформація про товари">
      <div className={styles.header}>
        <h2 className={styles.title}>Популярні товари</h2>
        <a href="/goods" className={styles.viewAll}>
          Всі товари
        </a>
      </div>

      <div className={styles.sliderWrapper}>
        {/* стрілка назад */}
        <button
          ref={prevRef}
          className={`${styles.arrow} ${styles.prev} ${
            isBeginning ? styles.disabled : ""
          }`}
          onClick={handlePrev}
          aria-label="Попередній"
          disabled={isBeginning}
        >
          ‹
        </button>

        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          onSwiper={setSwiper}
          onSlideChange={(s) => {
            setIsBeginning(s.isBeginning);
            setIsEnd(s.isEnd);
          }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
            1280: { slidesPerView: 4 },
          }}
          className={styles.swiper}
        >
          {goods.map((good) => (
            <SwiperSlide key={good._id}>
              <div className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={good.image || "/placeholder.jpg"}
                    alt={good.name}
                    className={styles.image}
                  />
                </div>

                <div className={styles.info}>
                  <p className={styles.category}>
                    {good.category || "Без категорії"}
                  </p>
                  <h3 className={styles.name}>{good.name}</h3>
                  <p className={styles.price}>
                    {good.price
                      ? `${good.price.value} ${good.price.currency}`
                      : "Ціну уточнюйте"}
                  </p>
                </div>

                <div className={styles.meta}>
                  <span>⭐ {good.feedbacks?.length ?? 0}</span>
                </div>

                <a href={`/goods/${good._id}`} className={styles.detailsBtn}>
                  Детальніше
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* стрілка вперед */}
        <button
          ref={nextRef}
          className={`${styles.arrow} ${styles.next} ${
            isEnd ? styles.disabled : ""
          }`}
          onClick={handleNext}
          aria-label="Наступний"
          disabled={isEnd}
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default GoodInfo;
