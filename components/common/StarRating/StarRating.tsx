"use client";

import styles from "./StarRating.module.css";

export default function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => onChange(n)}
          className={styles.starBtn}
          aria-label={`Оцінка ${n} зірок`}
        >
          <svg
            className={`${styles.star} ${n <= value ? styles.activeStar : ""}`}
          >
            <use href="/images/sprite.svg#star" />
          </svg>
        </button>
      ))}
    </div>
  );
}
