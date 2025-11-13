"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories, Category } from "@/utils/categories";
import { sortCategories } from "@/utils/sortCategories";
import CategoriesList from "../CategoriesList/CategoriesList";
import styles from "./PopularCategories.module.css";

export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        const sorted = sortCategories(data);
        setCategories(sorted);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      }
    })();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Популярні категорії</h2>
          <div className={styles.button}>
            <Link href="/categories" className={styles.link}>
              Всі категорії
            </Link>
          </div>
        </div>

        <CategoriesList categories={categories} variant="slider" />
      </div>
    </section>
  );
}
