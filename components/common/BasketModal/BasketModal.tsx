"use client";
import React, { useEffect } from "react";
import s from "./BasketModal.module.css";

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const BasketModal: React.FC<BasketModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) {
  //     onClose();
  //   }
  // };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <button
          type="button"
          className={s.closeBtn}
          onClick={onClose}
          aria-label="Закрити модальне вікно"
        >
          ×
        </button>
        <h2 className={s.title}>Ваш кошик</h2>

        {children}
        <div className={s.footer}>
          <button type="button" className={s.btnSecondary}>
            Продовжити покупки
          </button>

          <button type="button" className={s.btnPrimary}>
            Оформити замовлення
          </button>
        </div>
      </div>
    </div>
  );
};
