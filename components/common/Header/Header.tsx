"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";
import { useShopStore } from "@/lib/store/cartStore";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuth } = useAuth(); //hook

  const cartItems = useShopStore((state) => state.cartItems);

  const cartCount = cartItems.reduce((total, item) => total + item.amount, 0);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headercontainer}>
        <Link href="/" rel="noopener noreferrer">
          <svg className={styles.logo} width="100" height="20">
            <use href="/styles.icon.svg#icon-Clothica-1" />
          </svg>
        </Link>

        <nav className={styles.mainNav}>
          <Link href="/" className={styles.btnEntrance}>
            Головна
          </Link>
          <Link href="/goods" className={styles.btnEntrance}>
            Товари
          </Link>
          <Link href="/categories" className={styles.btnRegistration}>
            Категорії
          </Link>
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.headerActionsDiv}>
            {!isAuth && (
              <>
                <Link href="/auth/login" className={styles.headerButtonVhid}>
                  Вхід
                </Link>
                <Link
                  href="/auth/register"
                  className={styles.headerButtonRegistration}
                >
                  Реєстрація
                </Link>
              </>
            )}

            {isAuth && (
              <Link href="/profile" className={styles.headerButtonCabinet}>
                Кабінет
              </Link>
            )}
          </div>

          <button className={styles.menuBtn} onClick={toggleMenu}>
            <svg className={styles.headericon} width="20" height="20">
              <use href="/sprite.svg#menu" />
            </svg>
          </button>

          <Link href="/basket">
            <button className={`${styles.headercart} ${styles.specialBtn}`}>
              <svg className={styles.headeri} width="24" height="24">
                <use href="/styles.icon.svg#icon-shopping_cart" />
              </svg>

              {cartCount > 0 && <span className={styles.dot}>{cartCount}</span>}
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