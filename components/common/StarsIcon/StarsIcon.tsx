"use client";

import css from "./StarsIcon.module.css";

interface Props {
  rating: number;
}

export default function StarsIcon({ rating }: Props) {
  const safeRating = Math.max(0, Math.min(5, rating));

  const stars = Array.from({ length: 5 }, (_, i) => {
    const diff = safeRating - i;

    if (diff >= 1) {
      return (
        <svg key={i} className={css.starFull} aria-hidden="true">
          <use href="/sprite.svg#star_filled" />
        </svg>
      );
    }

    if (diff > 0) {
      return (
        <span key={i} className={css.partialWrap}>
          <svg className={css.starEmpty} aria-hidden="true">
            <use href="/sprite.svg#star" />
          </svg>
          <span className={css.partialFill} style={{ width: `${diff * 100}%` }}>
            <svg className={css.starFull} aria-hidden="true">
              <use href="/sprite.svg#star" />
            </svg>
          </span>
        </span>
      );
    }
    return (
      <svg key={i} className={css.starEmpty} aria-hidden="true">
        <use href="/sprite.svg#star" />
      </svg>
    );
  });

  return <div className={css.stars}>{stars}</div>;
}
