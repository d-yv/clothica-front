"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/utils/categories";
import { categoryImages } from "@/constants/categoryImages";
import styles from "./CategoryCard.module.css";

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      href={{
        pathname: "/goods",
        query: { categoryId: category.id },
      }}
      className={styles.card}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={
            categoryImages[category.name] ||
            "/images/categories/placeholder.jpg"
          }
          alt={category.name}
          fill
          className={styles.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <p className={styles.name}>{category.name}</p>
    </Link>
  );
}
