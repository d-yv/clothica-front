"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    Promise.resolve().then(() => {
      const token = localStorage.getItem("token");
      setIsAuth(Boolean(token));
    });

    Promise.resolve().then(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    });
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headercontainer}>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <svg className={styles.logo} width="100" height="20">
            <use href="/styles.icon.svg#icon-Clothica-1" />
          </svg>
        </a>

        <nav className={styles.mainNav}>
          <Link href="/" className={styles.btnEntrance}>Головна</Link>
          <Link href="/common/GoodsList" className={styles.btnEntrance}>Товари</Link>
          <Link href="/common/CategoriesList" className={styles.btnRegistration}>Категорії</Link>
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.headerActionsDiv}>
            {!isAuth && (
              <>
                <Link href="/auth/login" className={styles.headerButtonVhid}>Вхід</Link>
                <Link href="/auth/register" className={styles.headerButtonRegistration}>Реєстрація</Link>
              </>
            )}

            {isAuth && (
              <Link href="/cabinet" className={styles.headerButtonCabinet}>Кабінет</Link>
            )}
          </div>

          <button className={styles.menuBtn} onClick={toggleMenu}>
            <svg className={styles.headericon} width="20" height="20">
              <use href="/styles.icon.svg#icon-menu" />
            </svg>
          </button>

          <Link href="/forms/CreateOrderForm">
            <button className={`${styles.headercart} ${styles.specialBtn}`}>
              <svg className={styles.headeri} width="24" height="24">
                <use href="/styles.icon.svg#icon-shopping_cart" />
              </svg>

              {cartCount > 0 && (
                <span className={styles.dot}>{cartCount}</span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <MobileMenu isAuth={isAuth} onClose={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}
