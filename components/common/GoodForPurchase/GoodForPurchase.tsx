"use client";

import { Good } from "@/types/good";
import css from "./GoodForPurchase.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function GoodForPurchase({good}:{good:Good}) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      ;
    }
  };

  return (
    <div className={css.container}>
      <div className={css.col}>
        <div className={css.imageWrap}>
          <Image
            src={good.image}
            alt={good.name}
            fill
            className={css.image}
          />
        </div>
      </div>
      <div className={css.col}>
        <nav className={css.menuList}>
          <Link href="/goods" className={css.menuLink}>Всі товари</Link>
          <svg width="5" height="8" className={css.right}>
            <use href="/styles.icon.svg#icon-Chevron-Right" />
          </svg>
          <Link
            href={{
              pathname: "/goods",
              query: { categoryName: good.categoryName },
            }}
            className={css.menuLink}
          >
            Категорія
          </Link>
          <svg width="5" height="8" className={css.right}>
            <use href="/styles.icon.svg#icon-Chevron-Right" />
          </svg>
          <span className={css.menuCurrent}>{good.name}</span>
        </nav>
        <h1 className={css.header}>{good.name}</h1>
        <div className={css.priceContent}>
          <p className={css.price}>
            {good.price.value} {good.price.currency}
          </p>
          <div className={css.divider}></div>
          <div className={css.rating}>
            {Array.from({
              length: Math.max(1, Math.round(good.averageRate)),
            }).map((_, i) => (
              <svg key={i} className={css.stars} aria-hidden="true">
                <use href="/styles.icon.svg#icon-Star-Filled-2" />
              </svg>
            ))}
            <span className={css.feedback}>
              • {good.feedbackCount ?? 0} відгуків
            </span>
          </div>
        </div>

        <p className={css.about}>{good.prevDescription}</p>

        <div className={css.sizeSelector}>
          <label className={css.sizeLabel}>Розмір</label>
          <div className={css.selectWrapper}>
            <select className={css.sizeSelect}>
              {good.size.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <svg width="16" height="16" className={css.selectIcon}>
              <use href="/styles.icon.svg#icon-Chevron-Down" />
            </svg>
          </div>
        </div>

        <div className={css.buttonGroup}>
          <button className={css.btn1}>Додати в кошик</button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className={css.quantityInput}
            
          />
        </div>

        <button className={css.btn2}>Купити зараз</button>

        <p className={css.deliveryText}>
          Безкоштовна доставка для замовлень від 1000 грн
        </p>

        <div className={css.characteristics}>
          <h2 className={css.text}>Опис</h2>
          <p className={css.text}>{good.description}</p>

          <h3 className={css.text}>Основні характеристики</h3>
          <ul className={css.charList}>
            {good.characteristics.map((line: string, i: number) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}