// app/@modal/(.)basket/page.tsx
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import GoodsOrderList from "@/components/common/GoodsOrderList/GoodsOrderList";
import MessageNoInfo from "@/components/common/MessageNoInfo/MessageNoInfo";
import { useCart } from "@/lib/store/cart";
import css from "./modal.module.css";

export default function BasketModal() {
  const router = useRouter();
  const items = useCart((state) => state.items);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleGoToGoods = () => {
    handleClose();
    const id = setTimeout(() => {
      router.push("/goods");
      clearTimeout(id);
    }, 40);
  };

  const handleGoToOrder = () => {
    handleClose();
    const id = setTimeout(() => {
      router.push("/order");
      clearTimeout(id);
    }, 40);
  };

  return (
    <div
      // className={`${css.backdrop} ${closing ? css.hiddenBackdrop : css.visibleBackdrop}`}
      className={`${css.backdrop} ${css.visibleBackdrop}`}
      onClick={handleBackdropClick}
    >
      <div
        // className={`${css.modal} ${closing ? css.slideOut : css.slideIn}`}
        className={`${css.modal} ${css.slideIn}`}
      >
        <div className={css.closeBtnContainer}>
          <button className={css.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        <h2 className={css.title}>Кошик</h2>

        {items.length > 0 ? (
          <>
            <GoodsOrderList />
            <div className={css.actions}>
              <button className={css.secondaryButton} onClick={handleGoToGoods}>
                Продовжити покупки
              </button>
              <button className={css.primaryButton} onClick={handleGoToOrder}>
                Оформити замовлення
              </button>
            </div>
          </>
        ) : (
          <MessageNoInfo
            text="Ваш кошик порожній, мерщій до покупок!"
            buttonText="До покупок"
            route="/goods"
            onClick={handleGoToGoods}
          />
        )}
      </div>
    </div>
  );
}
