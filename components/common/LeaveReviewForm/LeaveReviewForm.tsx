"use client";

import { useState } from "react";
import StarRating from "../StarRating/StarRating";
import styles from "./LeaveReviewForm.module.css";


type LeaveReviewFormProps = {
  goodId: string;
  onClose?: () => void;
  onSuccess?: () => void | Promise<void>;
};

export default function LeaveReviewForm({
  goodId,
  onClose,
  onSuccess,
}: LeaveReviewFormProps) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rate, setRate] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!rate) {
      setError("Оцініть, будь ласка, товар");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedbacks/${goodId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: name,
            description: text,
            rate,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Не вдалося надіслати відгук");
      }

      if (onSuccess) {
        await onSuccess();
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.wrap}>
        {/* Хрестик */}
        <button
          className={styles.closeBtn}
          aria-label="Закрити"
          onClick={onClose}
          type="button"
        >
          <svg className={styles.closeIcon}>
            <use href="/styles.icon.svg#icon-close" />
          </svg>
        </button>


        <h2 className={styles.title}>Залишити відгук</h2>

        <form onSubmit={handleSubmit} className={styles.form}>

          <label className={styles.label}>
            Ваше імʼя
            <input
              className={styles.inputName}
              placeholder="Ваше імʼя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>


          <label className={styles.label}>
            Відгук
            <textarea
              className={styles.textarea}
              placeholder="Ваш відгук"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </label>

          {/* Зірочки */}
          <div className={styles.starsWrap}>
            <StarRating value={rate} onChange={setRate} />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {/* Кнопка */}
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Надсилаємо..." : "Надіслати"}
          </button>
        </form>
      </div>
    </div>
  );
}

