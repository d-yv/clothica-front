"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import "swiper/css";

import cssSection from "./GoodReviews.module.css";
import cssSlider from "./ReviewsList.module.css";
import MessageNoStories from "./MessageNoStories";
import LeaveReviewForm from "../LeaveReviewForm/LeaveReviewForm";

type Review = {
  _id: string;
  author: string;
  description: string;
  rate: number;
};

export default function GoodReviews({ goodId }: { goodId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(3);
  const swiperRef = useRef<import("swiper").Swiper | null>(null);

  // --- СТАН КНОПОК
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // --- СТАН МОДАЛКИ ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FETCH ФУНКЦІЯ (мемоізована) ---
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedbacks/${goodId}`,
        { cache: "no-store" }
      );

      const data = await response.json();
      // припускаємо, що бекенд повертає масив відгуків
      setReviews(Array.isArray(data) ? data : []);
      // setVisibleCount(3); // можна розкоментувати, якщо треба ресетити
    } catch (error) {
      console.error("Error:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [goodId]);

  // --- ПЕРВИННИЙ ЗАПИТ ---
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) return <p>Завантаження…</p>;

  if (reviews.length === 0)
    return (
      <>
        <section className={cssSection.section}>
          <div className={cssSection.headerRow}>
            <h2 className={cssSection.title}>Відгуки клієнтів</h2>
            <button
              type="button"
              className={cssSection.leaveReviewBtn}
              onClick={() => setIsModalOpen(true)}
            >
              Залишити відгук
            </button>
          </div>
          <MessageNoStories goodId={goodId} />
        </section>

        {isModalOpen && (
          <LeaveReviewForm
            goodId={goodId}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchReviews}
          />
        )}
      </>
    );

  // --- ЛОГІКА КНОПОК ---
  const handlePrevClick = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current?.slideNext();

    // додаткове підвантаження карток
    if (visibleCount < reviews.length) {
      setVisibleCount((prev) => Math.min(prev + 3, reviews.length));

      setTimeout(() => {
        swiperRef.current?.update();
      }, 0);
    }
  };

  return (
    <>
      <section className={cssSection.section}>
        {/* HEADER */}
        <div className={cssSection.headerRow}>
          <h2 className={cssSection.title}>Відгуки клієнтів</h2>

          <button
            type="button"
            className={cssSection.leaveReviewBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Залишити відгук
          </button>
        </div>

        {/* SLIDER */}
        <div className={cssSlider.sliderWrap}>
          <Swiper
            modules={[Keyboard]}
            spaceBetween={32}
            slidesPerView={1}
            keyboard={{ enabled: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1440: { slidesPerView: 3 },
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
            {reviews.slice(0, visibleCount).map((review) => (
              <SwiperSlide key={review._id} className={cssSlider.slide}>
                <article className={cssSlider.card}>
                  <div>
                    {Array.from({ length: review.rate }).map((_, i) => (
                      <svg
                        key={i}
                        className={cssSlider.stars}
                        aria-hidden="true"
                      >
                        <use href="/styles.icon.svg#icon-Star-Filled-2" />
                      </svg>
                    ))}

                    <p className={cssSlider.quote}>
                      &ldquo;{review.description}&rdquo;
                    </p>
                  </div>

                  <div className={cssSlider.footer}>
                    <p className={cssSlider.author}>{review.author}</p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* NAV BUTTONS */}
          <div className={cssSlider.navWrap}>
            {/* Prev */}
            <button
              onClick={handlePrevClick}
              disabled={isBeginning}
              className={`${cssSlider.navBtn} ${
                isBeginning ? cssSlider.navBtnDisabled : ""
              }`}
            >
              <svg className={cssSlider.icon}>
                <use href="/styles.icon.svg#icon-arrow-light" />
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={handleNextClick}
              disabled={isEnd}
              className={`${cssSlider.navBtn} ${
                isEnd ? cssSlider.navBtnDisabled : ""
              }`}
            >
              <svg className={cssSlider.icon}>
                <use href="/styles.icon.svg#icon-arrow-right" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <LeaveReviewForm
          goodId={goodId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchReviews}
        />
      )}
    </>
  );
}