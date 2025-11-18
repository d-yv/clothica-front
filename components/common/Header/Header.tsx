// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import MobileMenu from "../MobileMenu/MobileMenu";
// import styles from "./Header.module.css";

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isAuth, setIsAuth] = useState(false);
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     Promise.resolve().then(() => {
//       const token = localStorage.getItem("token");
//       setIsAuth(Boolean(token));
//     });

//     Promise.resolve().then(() => {
//       const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//       setCartCount(cart.length);
//     });
//   }, []);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   return (
//     <header className={styles.siteHeader}>
//       <div className={styles.headercontainer}>
//         <Link href="/" rel="noopener noreferrer">
//           <svg className={styles.logo} width="100" height="20">
//             <use href="/styles.icon.svg#icon-Clothica-1" />
//           </svg>
//         </Link>

//         <nav className={styles.mainNav}>
//           <Link href="/" className={styles.btnEntrance}>Головна</Link>
//           <Link href="/goods" className={styles.btnEntrance}>Товари</Link>
//           <Link href="/categories" className={styles.btnRegistration}>Категорії</Link>
//         </nav>

//         <div className={styles.headerActions}>
//           <div className={styles.headerActionsDiv}>
//             {!isAuth && (
//               <>
//                 <Link href="/auth/login" className={styles.headerButtonVhid}>Вхід</Link>
//                 <Link href="/auth/register" className={styles.headerButtonRegistration}>Реєстрація</Link>
//               </>
//             )}

//             {isAuth && (
//               <Link href="/profile" className={styles.headerButtonCabinet}>Кабінет</Link>
//             )}
//           </div>

//           <button className={styles.menuBtn} onClick={toggleMenu}>
//             <svg className={styles.headericon} width="20" height="20">
//               <use href="/sprite.svg#menu" />
//             </svg>
//           </button>

//           <Link href="/order">
//             <button className={`${styles.headercart} ${styles.specialBtn}`}>
//               <svg className={styles.headeri} width="24" height="24">
//                 <use href="/styles.icon.svg#icon-shopping_cart" />
//               </svg>

//               {cartCount > 0 && (
//                 <span className={styles.dot}>{cartCount}</span>
//               )}
//             </button>
//           </Link>
//         </div>
//       </div>

//       {isMenuOpen && (
//         <MobileMenu isAuth={isAuth} onClose={() => setIsMenuOpen(false)} />
//       )}
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";
import { useAuth } from "@/hooks/useAuth"; // <--- Імпортуємо хук

export default function Header() {
  const { isAuth, checkAuthStatus } = useAuth(); // <--- Беремо лише isAuth та checkAuthStatus
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Видаляємо стару, ручну логіку визначення isAuth з useEffect
  // і залишаємо лише логіку кошика та повторну перевірку статусу (якщо потрібно)
  useEffect(() => {
    // Оскільки хук useAuth запускається один раз, 
    // тут можна додати повторну перевірку (якщо потрібно для оновлення)
    checkAuthStatus();
    
    // Логіка кошика
    Promise.resolve().then(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    });
  }, [checkAuthStatus]); // Додаємо checkAuthStatus у залежності

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
          <Link href="/" className={styles.btnEntrance}>Головна</Link>
          <Link href="/goods" className={styles.btnEntrance}>Товари</Link>
          <Link href="/categories" className={styles.btnRegistration}>Категорії</Link>
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.headerActionsDiv}>
            {/* Логіка перемикання Вхід/Реєстрація vs Кабінет */}
            {!isAuth && (
              <>
                <Link href="/auth/login" className={styles.headerButtonVhid}>Вхід</Link>
                <Link href="/auth/register" className={styles.headerButtonRegistration}>Реєстрація</Link>
              </>
            )}

            {isAuth && (
              <Link href="/profile" className={styles.headerButtonCabinet}>Кабінет</Link>
            )}
          </div>

          <button className={styles.menuBtn} onClick={toggleMenu}>
            <svg className={styles.headericon} width="20" height="20">
              <use href="/sprite.svg#menu" />
            </svg>
          </button>

          <Link href="/order">
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

      {/* У MobileMenu все одно можна передати isAuth */}
      {isMenuOpen && (
        <MobileMenu isAuth={isAuth} onClose={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}