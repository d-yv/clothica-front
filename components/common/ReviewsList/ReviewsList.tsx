'use client';
import StarsIcon from "@/components/common/StarsIcon/StarsIcon";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import css from "./ReviewsList.module.css";
import { api } from "@/app/api/api";
import axios from "axios";
import type { Swiper as SwiperType } from "swiper";

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

  const swiperRef = useRef<SwiperType | null>(null);
  // const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  // const nextBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get<Review[]>("/feedbacks", {
          headers: { "Cache-Control": "no-cache" },
        });

        setReviews(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Помилка при отриманні відгуків:", err.message);
        } else {
          console.error("Помилка при отриманні відгуків:", err);
        }
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
          modules={[Keyboard, A11y]}
          spaceBetween={32}
          slidesPerView={1}
          slidesPerGroup={1}
          speed={1200} 
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          breakpoints={{
            768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 32 },
            1440: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 32 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide tag="li" key={review._id.$oid} className={css.slide}>
              <article className={css.card}>
                <div>
                  {/* {Array.from({
                    length: Math.max(1, Math.round(review.rate)),
                  }).map((_, i) => (
                    <svg key={i} className={css.stars} aria-hidden="true">
                      <use href="/styles.icon.svg#icon-Star-Filled-2" />
                    </svg>
                  ))} */}
                  <StarsIcon rating={review.rate} />
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

        <div className={css.navWrap}>
          <button
            // ref={prevBtnRef}
            onClick={handlePrevClick}
            disabled={isBeginning}
            className={`${css.navBtn} ${isBeginning ? css.navBtnDisabled : ""}`}
            aria-label="Попередній"
            type="button"
          >
            <svg className={css.icon} width="24" height="24" aria-hidden="true">
              <use href="/styles.icon.svg#icon-arrow-light" />
            </svg>
          </button>

          <button
            // ref={nextBtnRef}
            onClick={handleNextClick}
            disabled={isEnd}
            className={`${css.navBtn} ${isEnd ? css.navBtnDisabled : ""}`}
            aria-label="Наступний"
            type="button"
          >
            <svg className={css.icon} width="24" height="24" aria-hidden="true">
              <use href="/styles.icon.svg#icon-arrow-right" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
