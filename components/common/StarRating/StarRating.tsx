"use client";

import styles from "./StarRating.module.css";

export default function StarRating({ value, onChange }) {
  return (
    <div className={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = n <= value ? "star-filled" : "star";

        return (
          <button
            type="button"
            key={n}
            onClick={() => onChange(n)}
            className={styles.starBtn}
            aria-label={`Оцінка ${n} зірок`}
          >
            <svg
              className={`${styles.star} ${
                n <= value ? styles.activeStar : ""
              }`}
            >
              <use
                href={`/sprite.svg#${icon}`}
                xlinkHref={`/sprite.svg#${icon}`}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
