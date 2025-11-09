"use client";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Review {
  _id: {
    $oid: string;
  };
  author: string;
  date: string;
  description: string;
  rate: number;
  category: string;
  productId: {
    $oid: string;
  };
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList = ({ reviews }: ReviewsListProps) => {
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(true);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);

  const swiperRef = useRef<any>(null);

  // 🟢 Обробник натискання "Наступна" — підвантажує ще 3 картки
  const handleNextClick = () => {
    if (visibleReviewsCount < reviews.length) {
      setVisibleReviewsCount((prev) => Math.min(prev + 3, reviews.length));
    }
    // якщо всі відгуки вже показані — дизейбл
    if (visibleReviewsCount + 3 >= reviews.length) {
      setCanSlideNext(false);
    }
  };

  // 🟢 Обробник натискання "Попередня"
  const handlePrevClick = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  return (
    <section className="max-w-6xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Останні відгуки</h2>

      <div className="relative">
        <Swiper
          tabIndex={0} // ✅ дозволяє навігацію клавіатурою
          modules={[Navigation, Keyboard, A11y]}
          spaceBetween={20}
          slidesPerView={3}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          keyboard={{ enabled: true }}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          onSlideChange={(swiper) => {
            setCanSlidePrev(!swiper.isBeginning);
            setCanSlideNext(!swiper.isEnd);
          }}
          breakpoints={{
            1024: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
        >
          {reviews.slice(0, visibleReviewsCount).map((review) => (
            <SwiperSlide key={review._id.$oid}>
              <div className="border rounded-2xl p-4 shadow-sm bg-white h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-lg">
                      {"★".repeat(Math.round(review.rate))}
                    </span>
                    <span className="text-gray-400 ml-1">
                      {review.rate.toFixed(1)}
                    </span>
                  </div>
                  <p className="italic text-gray-700 mb-3">
                    {review.description}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-sm text-gray-500">{review.category}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Стрілки */}
        <button
          onClick={handlePrevClick}
          disabled={!canSlidePrev}
          className={`prev-btn absolute -left-6 top-1/2 transform -translate-y-1/2 rounded-full p-2 text-gray-700 transition bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-green-500 ${
            !canSlidePrev ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Попередній"
          type="button"
        >
          ←
        </button>

        <button
          onClick={handleNextClick}
          disabled={!canSlideNext}
          className={`next-btn absolute -right-6 top-1/2 transform -translate-y-1/2 rounded-full p-2 text-gray-700 transition bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-green-500 ${
            !canSlideNext ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Наступний"
          type="button"
        >
          →
        </button>
      </div>
    </section>
  );
};

export default ReviewsList;
