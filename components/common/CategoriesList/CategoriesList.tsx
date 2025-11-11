'use client'
import { useState } from "react";
import css from './CategoriesList.module.css'

const categories = [
  { 
    id: 'tshirts', 
    name: 'Футболки', 
    image: '/images/tshirts.jpg' 
  },
  { 
    id: 'hoodies', 
    name: 'Худі та світшоти', 
    image: '/images/hoodies.jpg' 
  },
  { 
    id: 'jeans', 
    name: 'Джинси та штани', 
    image: '/images/jeans.jpg' 
  },
  { 
    id: 'dresses', 
    name: 'Сукні та спідниці', 
    image: '/images/dresses.jpg' 
  },
  { 
    id: 'jackets', 
    name: 'Куртки та верхній одяг', 
    image: '/images/jackets.jpg' 
  },
  { 
    id: 'homewear', 
    name: 'Домашній та спортивний одяг', 
    image: '/images/homewear.jpg' 
  },
  { 
    id: 'tops', 
    name: 'Топи та майки', 
    image: '/images/tops.jpg' 
  }
];

const CategoriesList = () => {
    const [showAll, setShowAll] = useState(false);
    const visibleCategories = showAll ? categories : categories.slice(0, 6);

    return (
        <section className={css.wrap}>
        <div className='container'>
            <div className={css.content}>
            <h1 className={css.header}>Категорії</h1>
            <ul className={css.grid}>
                {visibleCategories.map((category) => (
                    <li key={category.id} className={css.gridItem}>
                        <a href={`/category/${category.id}`} className={css.card}>
                            <div className={css.imageWrapper}>
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className={css.image}
                                />
                            </div>
                            <h2 className={css.title}>{category.name}</h2>
                        </a>
                    </li>
                ))}
            </ul>

            <div className={css.buttonWrapper}>
                <button className={css.button}
                    onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Показати менше' : 'Показати більше'}
                </button>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default CategoriesList;