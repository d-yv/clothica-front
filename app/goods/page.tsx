'use client';


import { useState } from 'react';
import CategoriesFilter from '@/components/common/CategoriesFilter/CategoriesFilter';
import styles from './GoodsPage.module.css';

export default function GoodsPage() {
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);

  return (
    <div className="container">
      <h2>{activeCategoryName ?? 'Всі товари'}</h2>
      <CategoriesFilter onCategoryChange={setActiveCategoryName} />
      {/* <GoodsList/> */}
    </div>
  );
}