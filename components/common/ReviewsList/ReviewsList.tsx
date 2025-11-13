"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import css from "./ReviewsList.module.css";

type Review = {
  _id: { $oid: string };
  author: string;
  date: string;
  description: string;
  rate: number;
  category: string;
  productId: { $oid: string };
};

export default function ReviewsSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const swiperRef = useRef<any>(null);
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const base = `${process.env.NEXT_PUBLIC_BACKEND_URL}/API`;
      try {
        const res = await fetch(`${base}/feedbacks`, { cache: "no-store" });
        if (!res.ok) throw new Error("Помилка запиту");
        const data: Review[] = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Помилка при отриманні відгуків:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handlePrevClick = () => swiperRef.current?.slidePrev();
  const handleNextClick = () => swiperRef.current?.slideNext();

  if (loading) {
    return (
      <section className={css.loadingWrap}>
        <p>Завантаження відгуків…</p>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className={css.loadingWrap}>
        <p>Немає відгуків для відображення</p>
      </section>
    );
  }

  return (
    <section className={css.section}>
        <div className={css.sliderWrap}>
          <Swiper
            tag="ul"
            modules={[Navigation, Keyboard, A11y]}
            spaceBetween={32}
            slidesPerView={1} /* мобільний — 1 */
             slidesPerGroup={1} 
            keyboard={{ enabled: true }}
            a11y={{ enabled: true }}
            breakpoints={{
              768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 32 }, // планшет — 2
              1440: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 32 }, // десктоп — 3
            }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
              swiper.params.navigation = {
                prevEl: prevBtnRef.current,
                nextEl: nextBtnRef.current,
              };
            }}
            onAfterInit={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
          >
            {reviews.map((review) => (
              <SwiperSlide
                tag="li"
                key={review._id.$oid}
                className={css.slide}
              >
                <article className={css.card}>
                  <div>
                      {Array.from({
                        length: Math.max(1, Math.round(review.rate)),
                      }).map((_, i) => (
                        <svg
                          key={i}
                          className={css.stars}
                          aria-hidden="true"
                        >
                          <use href="/styles.icon.svg#icon-Star-Filled-2" />
                        </svg>
                      ))}
                    <p className={css.quote}>
                      &ldquo;{review.description}&rdquo;
                    </p>
                  </div>

                  <div className={css.footer}>
                    <p className={css.author}>{review.author}</p>
                    <p className={css.category}>{review.category}</p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Стрілки */}
          <div className={css.navWrap}>
            <button
              ref={prevBtnRef}
              onClick={handlePrevClick}
              disabled={isBeginning}
              className={`${css.navBtn} ${
                isBeginning ? css.navBtnDisabled : ""
              }`}
              aria-label="Попередній"
              type="button"
            >
              <svg
                className={css.icon}
                width="24"
                height="24"
                aria-hidden="true"
              >
                <use href="/styles.icon.svg#icon-arrow-light"></use>
              </svg>
            </button>

            <button
              ref={nextBtnRef}
              onClick={handleNextClick}
              disabled={isEnd}
              className={`${css.navBtn} ${isEnd ? css.navBtnDisabled : ""}`}
              aria-label="Наступний"
              type="button"
            >
              <svg
                className={css.icon}
                width="24"
                height="24"
                aria-hidden="true"
              >
                <use href="/styles.icon.svg#icon-arrow-right"></use>
              </svg>
            </button>
          </div>
        </div>
    </section>
  );
}