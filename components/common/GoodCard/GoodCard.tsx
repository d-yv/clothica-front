import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./GoodCard.module.css";
import { Good } from "@/types/good";
import { api } from "@/app/api/api";
import { Feedback } from "@/types/feedback";

export default function GoodCard({ good }: { good: Good }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRate, setAverageRate] = useState(0);
  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/feedbacks/${good._id}`);
      const data: Feedback[] = Array.isArray(res.data.feedbacks)
        ? res.data.feedbacks
        : [];

      setFeedbacks(data);

      if (data.length > 0) {
        const avg =
          data.reduce((sum: number, f: Feedback) => sum + f.rate, 0) /
          data.length;

        setAverageRate(Number(avg.toFixed(1)));
      }
    };
    load();
  }, [good._id]);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={good.image}
          alt={good.name}
          width={335}
          height={260}
          className={styles.image}
          priority
        />
      </div>

      <div className={styles.info}>
        <div className={styles.text}>
          <h3 className={styles.name}>{good.name}</h3>
          <div className={styles.meta}>
              <svg className={styles.icon} width="16" height="16" aria-hidden="true">
                <use href="/sprite.svg#star filled"></use>
              </svg>
             <p>{averageRate}</p> 
              <svg className={styles.icon} width="16" height="16" aria-hidden="true">
                <use href="/sprite.svg#comment"></use>
              </svg>
              <p>{feedbacks.length}</p>
          </div>
        </div>
        <p className={styles.price}>
          {good.price.value} {good.price.currency}
        </p>
      </div>
      <Link href={`/goods/${good._id}`} className={styles.detailsBtn}>
        Детальніше
      </Link>
    </div>
  );
}
