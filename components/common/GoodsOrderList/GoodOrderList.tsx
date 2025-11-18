'use client';

import Image from "next/image";
import { useCart } from "@/lib/store/cart";
import s from "./GoodOrderList.module.css";

function formatMoney(v:number,c="грн"){ return `${v.toLocaleString("uk-UA")} ${c}` }

export default function GoodsOrderList() {
  const items = useCart(s=>s.items);
  const add = useCart(s=>s.add);
  const dec = useCart(s=>s.decrement);
  const rm = useCart(s=>s.remove);
  const subtotal = useCart(s=>s.subtotal);

  if (!items.length) return <p style={{textAlign:"center"}}>Кошик порожній</p>;

  const currency = items[0]?.price.currency ?? "грн";
  const sub = subtotal();
  const delivery = 0; const total = sub + delivery;

  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>Ваш кошик</h2>

      <ul className={s.list}>
        {items.map(item => (
         <li key={item._id} className={s.item}>
  <div className={s.thumbWrap}>
    <Image src={item.image} alt={item.name} width={82} height={101} className={s.thumb}/>
  </div>

  <div className={s.info}>
    <h3 className={s.name}>{item.name}</h3>

    <div className={s.metaRow}>
      <svg className={s.icon} width="16" height="16" aria-hidden="true">
        <use href="/sprite.svg#star filled"/>
      </svg>
      <span>{item.averageRate ?? 5}</span>
      <svg className={s.icon} width="16" height="16" aria-hidden="true">
        <use href="/sprite.svg#comment"/>
      </svg>
      <span>{item.feedbackCount ?? 2}</span>
    </div>

    {}
    <div className={s.priceRow}>
      <div className={s.price}>{formatMoney(item.price.value, currency)}</div>

      <div className={s.controls}>
        <input
          type="number"
          className={s.qtyInput}
          value={item.quantity}
          min={1}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isNaN(v) || v < 1) return;
            if (v > item.quantity) add(item);
            if (v < item.quantity) dec(item._id);
          }}
          aria-label="Кількість"
        />
        <button
          className={s.trash}
          onClick={() => rm(item._id)}
          aria-label="Видалити товар"
          title="Видалити"
        >
          <svg className={s.icon} width="18" height="18" aria-hidden="true">
            <use href="/styles.icon.svg#icon-trash"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</li>
        ))}
      </ul>

      <div className={s.summary}>
        <div className={s.row}><span>Проміжний підсумок</span><span>{formatMoney(sub, currency)}</span></div>
        <div className={s.row}><span>Доставка</span><span>—</span></div>
        <div className={`${s.row} ${s.total}`}><span>Всього</span><span>{formatMoney(total, currency)}</span></div>
      </div>
    </div>
  );
}
