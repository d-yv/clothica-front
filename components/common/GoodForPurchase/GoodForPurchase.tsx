'use client'


import { Good } from "@/types/good";
import css from "./GoodForPurchase.module.css";
import Image from "next/image";
import { useCart } from "@/lib/store/cart";


export default function GoodForPurchase ({good}:{good:Good}) {
  const addToCart = useCart((s) => s.add);
  return (
      <div className="container">
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
                  <h1 className={css.header}>{good.name}</h1>
                  <p className={css.price}> {good.price.value} {good.price.currency} </p>
                  <p className={css.about}>{good.prevDescription }</p>
                  <button
  className={css.btn1}
  onClick={() => {
    addToCart(good);
  }}>Додати в кошик</button>
                  <button className={css.btn2}>Купити зараз</button>
                  <p className={css.text}>Безкоштовна доставка для замовлень від 1000 грн</p>
                  <p>Опис</p>
                  <p>{good.description}</p>
                  <p>Основні характеристики</p>
                  <p>{ good.characteristics}</p>
              </div>  
             
                 
             
      </div>
    </div>
  );
}
