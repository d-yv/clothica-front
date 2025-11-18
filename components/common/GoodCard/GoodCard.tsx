import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./GoodCard.module.css";
import { Good } from "@/types/good";
import { api } from "@/app/api/api";
import { Feedback } from "@/types/feedback";

interface GoodStats {
    reviewCount: number;
    averageRate: number;
}

export default function GoodCard({ good }: { good: Good }) {
    const [stats, setStats] = useState<GoodStats>({ reviewCount: 0, averageRate: 0 }); 
    

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/feedbacks/${good._id}`);
              
                const data: Feedback[] = Array.isArray(res.data)
                    ? res.data 
                    : Array.isArray(res.data.feedbacks)
                    ? res.data.feedbacks
                    : [];

                const count = data.length;
                let average = 0;

                if (count > 0) {
                    const totalRate = data.reduce((sum: number, f: Feedback) => sum + f.rate, 0);
                    const avg = totalRate / count;
                    average = Number(avg.toFixed(1)); 
                }

                setStats({ 
                    reviewCount: count, 
                    averageRate: average 
                });

            } catch (error) {
                console.error("Помилка завантаження відгуків для картки:", error);
                setStats({ reviewCount: 0, averageRate: 0 });
            }
        };
        load();
    }, [good._id]);

//     if (stats.averageRate !== 5) {
//     return <></>;
// }

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

                        <span className={styles.spansvg}>
                          <svg  width="16" height="16" aria-hidden="true">
                              <use href="/styles.icon.svg#icon-Star-Filled-2"></use>
                          </svg>
                          <span>{stats.averageRate}</span>
                        </span>
                         
                        <span className={styles.spansvg}>
                          <svg className={styles.icon} width="16" height="16" aria-hidden="true">
                              <use href="/sprite.svg#comment"></use>
                          </svg>
                          <span>{stats.reviewCount}</span>
                        </span>
                         
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