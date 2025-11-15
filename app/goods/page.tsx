"use client";

import { useState } from "react";

import CategoriesFilter from "@/components/common/CategoriesFilter/CategoriesFilter";
import GoodsList from "@/components/common/GoodsList/GoodsList";

import styles from "./GoodsPage.module.css";

export default function GoodsPage() {
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(
    null
  );

  const title = activeCategoryName ?? "Всі товари";

  return (
    <main className="style">
      <div className="container">
        <h1 className="title">{title}</h1>

        <section className={styles.content}>
          <aside className={styles.sidebar}>
            <CategoriesFilter onCategoryChange={setActiveCategoryName} />
          </aside>

          <div className={styles.listArea}>
            <GoodsList />
          </div>
        </section>
      </div>
    </main>
  );
}
