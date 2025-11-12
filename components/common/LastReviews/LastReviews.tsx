
import css from './LastReviews.module.css';
import ReviewsList from "@/components/common/ReviewsList/ReviewsList"

export default function LastReviews() {
  return (
    <section className={css.lastreviews}>
      <div className={css.container}>
        <div>
          <h2 className={css.title}>Останні відгуки</h2>
          <ReviewsList />
        </div>
      </div>
    </section>
  );
}