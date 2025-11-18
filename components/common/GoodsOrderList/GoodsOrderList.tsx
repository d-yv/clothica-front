'use client';

import Image from "next/image";
import s from "./GoodsOrderList.module.css";
import { useShopStore } from "@/lib/store/cartStore";

function formatMoney(v: number, c = "грн") {
  return `${v.toLocaleString("uk-UA")} ${c}`;
}

export default function GoodsOrderList() {
  const items = useShopStore((s) => s.cartItems);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const updateAmount = useShopStore((s) => s.updateAmount);

  if (!items.length) {
    return <p style={{ textAlign: "center" }}>Кошик порожній</p>;
  }

  const currency = "грн";
  const sub = items.reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );
  const delivery = 0;
  const total = sub + delivery;

  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>Ваш кошик</h2>

      <ul className={s.list}>
        {items.map((item) => (
          <li key={`${item.goodId}-${item.size}`} className={s.item}>
            <div className={s.thumbWrap}>
              <Image
                src={item.image ?? "/placeholder.png"}
                alt={item.name}
                width={82}
                height={101}
                className={s.thumb}
              />
            </div>

            <div className={s.info}>
              <h3 className={s.name}>{item.name}</h3>

              <div className={s.metaRow}>
                <svg className={s.icon} width="16" height="16" aria-hidden="true">
                  <use href="/sprite.svg#star-filled" />
                </svg>
                <span>{item.rate ?? 5}</span>

                <svg className={s.icon} width="16" height="16" aria-hidden="true">
                  <use href="/sprite.svg#comment" />
                </svg>
                <span>{item.reviewsNumber ?? 0}</span>

                <span className={s.size}>Розмір: {item.size}</span>
              </div>

              <div className={s.priceRow}>
                <div className={s.price}>
                  {formatMoney(item.price, currency)}
                </div>

                <div className={s.controls}>
                  <input
                    type="number"
                    className={s.qtyInput}
                    value={item.amount}
                    min={1}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isNaN(v) || v < 1) return;
                      updateAmount(item.goodId, item.size, v);
                    }}
                    aria-label="Кількість"
                  />

                  <button
                    className={s.trash}
                    onClick={() => removeFromCart(item.goodId, item.size)}
                    aria-label="Видалити товар"
                    title="Видалити"
                  >
                    <svg className={s.icon} width="18" height="18" aria-hidden="true">
                      <use href="/sprite.svg#icon-trash" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className={s.summary}>
        <div className={s.row}>
          <span>Проміжний підсумок</span>
          <span>{formatMoney(sub, currency)}</span>
        </div>
        <div className={s.row}>
          <span>Доставка</span>
          <span>—</span>
        </div>
        <div className={`${s.row} ${s.total}`}>
          <span>Всього</span>
          <span>{formatMoney(total, currency)}</span>
        </div>
      </div>
    </div>
  );
}
