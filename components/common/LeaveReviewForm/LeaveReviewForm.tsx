"use client";

import { useState } from "react";
import StarRating from "../StarRating/StarRating";
import styles from "./LeaveReviewForm.module.css";

export default function LeaveReviewForm({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rate, setRate] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Відправлено:", { name, text, rate });
    if (onClose) onClose();
  };

  return (
    <div className={styles.backdrop}>
      {/* 🔥 Контейнер для токенів */}
      <div className={styles.wrap}>
        {/* Хрестик */}
        <button
          className={styles.closeBtn}
          aria-label="Закрити"
          onClick={onClose}
        >
          <svg className={styles.closeIcon}>
            <use href="/sprite.svg#close" xlinkHref="/sprite.svg#close" />
          </svg>
        </button>

        {/* Заголовок */}
        <h2 className={styles.title}>Залишити відгук</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Імʼя */}
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

          {/* Відгук */}
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

          {/* Кнопка */}
          <button type="submit" className={styles.submitBtn}>
            Надіслати
          </button>
        </form>
      </div>
    </div>
  );
}
