"use client";

import Link from "next/link";
import css from "./ReviewsList.module.css";

export default function MessageNoStories({ goodId }: { goodId: string }) {
  return (
    <div className={css.noReviewsBox}>
      <p className={css.noReviewsText}>У цього товару ще немає відгуків</p>

      <Link href={`/leave-feedback/${goodId}`} className={css.reviewBtn}>
        Залишити відгук
      </Link>
    </div>
  );
}
