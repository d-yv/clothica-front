"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isAuth = !!authToken;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headercontainer}>
        <svg className={styles.logo} width="100" height="20">
          <use href="/styles.icon.svg#icon-Clothica-1" />
        </svg>

        <nav className={styles.mainNav}>
          <Link href="/" className={styles.btnEntrance}>Головна</Link>
          <Link href="/components/common/PopularGoods" className={styles.btnEntrance}>Товари</Link>
          <Link href="/components/common/PopularCategories" className={styles.btnRegistration}>Категорії</Link>
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.headerActionsDiv}>
            {!isAuth && (
              <>
                <Link href="/components/forms/LoginForm" className={styles.headerButtonVhid}>Вхід</Link>
                <Link href="/components/forms/RegistrationForm" className={styles.headerButtonRegistration}>Реєстрація</Link>
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

          <Link href="/components/forms/CreateOrderForm">
            <button className={`${styles.headercart} ${styles.specialBtn}`}>
              <svg className={styles.headeri} width="20" height="20">
                <use href="/styles.icon.svg#icon-shopping_cart" />
              </svg>
              <span className={styles.dot}></span>
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
