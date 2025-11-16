import Link from "next/link";
import Image from "next/image";
import styles from "./GoodCard.module.css";
import { Good } from "@/types/good";

export default function GoodCard({ good }: { good: Good }) {
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

      <div className={styles.text}>
        <h3 className={styles.name}>{good.name}</h3>
        <p className={styles.price}>
          {good.price.value} {good.price.currency}
        </p>
      </div>

      <div className={styles.meta}>
        <span>$ {good.averageRate?.toFixed(1) ?? "0"}</span>
        <span>$ {good.feedbackCount ?? 0}</span>
      </div>

      <Link href={`/goods/${good._id}`} className={styles.detailsBtn}>
        Детальніше
      </Link>
    </div>
  );
}
