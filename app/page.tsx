"use client";

import { useEffect, useState } from "react";
import ReviewsList from "../components/common/ReviewsList/page";

export default function Page() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:3030/api/feedbacks");
        if (!res.ok) throw new Error("Помилка запиту");
        const data = await res.json();
        console.log("Отримані відгуки:", data); // Для перевірки
        setReviews(data);
      } catch (err) {
        console.error("Помилка при отриманні відгуків:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {loading ? (
        <p className="text-center text-gray-500 pt-10">
          Завантаження відгуків...
        </p>
      ) : reviews.length > 0 ? (
        <ReviewsList reviews={reviews} />
      ) : (
        <p className="text-center text-gray-500 pt-10">
          Немає відгуків для відображення
        </p>
      )}
    </main>
  );
}
