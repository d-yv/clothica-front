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

// URL бекенду
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://clothica-back.onrender.com";

// axios клієнт
export const api = axios.create({
  baseURL: BACKEND_URL,
});

//Тип товару
export interface Good {
  _id: string;
  title: string;
  price?: number;
  currency?: string;
  category?: string;
  image?: string;
  likes?: number;
  reviewsCount?: number;
}

//Запит усіх товарів
export const getGoods = async (): Promise<Good[]> => {
  const res = await api.get("api/goods");
  return res.data;
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

  //Завантаження товарів
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getGoods();
        // if (!mounted) return;
        // // максимум 10 товарів
        // let goodsToShow = data.slice(0, 10);
        // while (goodsToShow.length < 10 && data.length > 0) {
        //   const toAdd = 10 - goodsToShow.length;
        //   goodsToShow = [...goodsToShow, ...data.slice(0, toAdd)];
        // }
        // setGoods(goodsToShow);
      } catch (err) {
        if (!mounted) return;
        const errorMessage =
          err instanceof Error ? err.message : "Помилка завантаження";
        setError(errorMessage);
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

        {/* Swiper */}
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
                    src={
                      good.image?.startsWith("http")
                        ? good.image
                        : `${BACKEND_URL}/${good.image}`
                    }
                    alt={good.title}
                    className={styles.image}
                  />
                </div>

                <div className={styles.info}>
                  <p className={styles.category}>
                    {good.category || "Без категорії"}
                  </p>
                  <h3 className={styles.name}>{good.title}</h3>
                  <p className={styles.price}>
                    {good.price
                      ? `${good.price} ${good.currency || "UAH"}`
                      : "Ціну уточнюйте"}
                  </p>
                </div>

                <div className={styles.meta}>
                  <span>❤️ {good.likes || 0}</span>
                  <span>⭐ {good.reviewsCount || 0}</span>
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
