// components/Footer/Footer.tsx
'use client'; 

import React from "react";
import styles from  "./Footer.module.css";
import Link from "next/link";
import { useSimpleSubscription } from "@/hooks/useSimpleSubscription"; 

const Footer: React.FC = () => {
  const { state, handleSubmit } = useSimpleSubscription();
  const { message, isSuccess } = state;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.menusection}>
          <Link href="/" className={styles.logo_link}>
            <svg className={styles.logo} width="28" height="28">
              <use href="/styles.icon.svg#icon-Clothica-1" />
            </svg>
          </Link>

          <nav className={styles.menu} aria-label="Меню сайту">
            <h3 className={styles.menuTitle}>Меню</h3>
            <ul className={styles.menuList}>
              <li><Link className={styles.menuLink} href="/">Головна</Link></li>
              <li><Link className={styles.menuLink} href="/goods">Товари</Link></li>
              <li><Link className={styles.menuLink} href="/categories">Категорії</Link></li>
            </ul>
          </nav>
        </div>
      
        <section className={styles.newsletter} aria-labelledby="footer-subscribe">
          <h3 id="footer-subscribe" className={styles.subtitle}>Підписатися</h3>
          <p className={styles.lead}>
            Приєднуйтесь до нашої розсилки, щоб бути в курсі новин та акцій.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label htmlFor="newsletter-email" className={styles.srOnly}>Email</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              inputMode="email"
              placeholder="Введіть ваш email"
              className={styles.input}
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Введіть коректну електронну адресу"
              aria-describedby="subscription-message"
            />
            <button type="submit" className={styles.button}>Підписатися</button>
          </form>

          {message && (
            <p 
              id="subscription-message" 
              role="alert" 
              className={isSuccess ? styles.successMessage : styles.errorMessage}
              style={{ 
                marginTop: '10px', 
                color: isSuccess ? 'green' : 'red' 
              }}
            >
              {message}
            </p>
          )}

        </section>

        <div className={styles.bottom}>
          <p className={styles.copy}>© 2025 Clothica. Всі права захищені.</p>

          <ul className={styles.socials}>
            <li>
              <a className={styles.linkicon} href="https://www.facebook.com/" target="_blank"  aria-label="Facebook">
                <svg className={styles.icon} width="32" height="32">
                  <use href="/styles.icon.svg#icon-facebook" />
                </svg>
              </a>
            </li>

            <li>
              <a className={styles.linkicon} href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
                <svg className={styles.icon} viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
                  <use href="/styles.icon.svg#icon-instagram1" />
                </svg>
              </a>
            </li>

            <li>
              <a className={styles.linkicon} href="https://x.com/" target="_blank" aria-label="X">
                <svg className={styles.icon}width="32" height="32">
                  <use href="/styles.icon.svg#icon-sm" />
                </svg>
              </a>
            </li>

            <li>
              <a className={styles.linkicon} href="https://www.youtube.com/" target="_blank"  aria-label="YouTube">
                <svg className={styles.icon} width="32" height="32" aria-hidden="true" focusable="false">
                  <use  href="/styles.icon.svg#icon-youtube" />
                </svg>
              </a>
            </li>
          </ul>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
