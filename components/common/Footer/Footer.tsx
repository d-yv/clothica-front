'use client'

import React from "react";
import styles from  "./Footer.module.css";
import Link from "next/link";
import Image from 'next/image';



const Footer: React.FC = () => {
  const year = 2025;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("email") as HTMLInputElement | null;

    if (input?.checkValidity()) {
      console.log("Subscribed:", input.value);
      form.reset();
    } else {
      input?.reportValidity();
    }
  };

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
          <li><a className={styles.menuLink} href="/">Головна</a></li>
          <li><a className={styles.menuLink} href="/products">Товари</a></li>
          <li><a className={styles.menuLink} href="/categories">Категорії</a></li>
        </ul>
      </nav>
</div>
      {/* Підписка */}
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
          />
          <button type="submit" className={styles.button}>Підписатися</button>
        </form>
        </section>



        {/* Bottom */}
        <div className={styles.bottom}>
                <p className={styles.copy}>© 2025 Clothica. Всі права захищені.</p>

      <ul className={styles.socials}>
  <li >
    <a className={styles.linkicon} href="https://www.facebook.com/" target="_blank"  aria-label="Facebook">
      <svg className={styles.icon} width="32" height="32">
        <use href="/styles.icon.svg#icon-facebook" />
      </svg>
    </a>
  </li>

  <li >
    <a className={styles.linkicon} href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
       <svg className={styles.icon} viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
<path d="M16 2.881c4.275 0 4.781 0.019 6.462 0.094 1.563 0.069 2.406 0.331 2.969 0.55 0.744 0.288 1.281 0.638 1.837 1.194 0.563 0.563 0.906 1.094 1.2 1.838 0.219 0.563 0.481 1.412 0.55 2.969 0.075 1.688 0.094 2.194 0.094 6.463s-0.019 4.781-0.094 6.463c-0.069 1.563-0.331 2.406-0.55 2.969-0.288 0.744-0.637 1.281-1.194 1.837-0.563 0.563-1.094 0.906-1.837 1.2-0.563 0.219-1.413 0.481-2.969 0.55-1.688 0.075-2.194 0.094-6.463 0.094s-4.781-0.019-6.463-0.094c-1.563-0.069-2.406-0.331-2.969-0.55-0.744-0.288-1.281-0.637-1.838-1.194-0.563-0.563-0.906-1.094-1.2-1.837-0.219-0.563-0.481-1.413-0.55-2.969-0.075-1.688-0.094-2.194-0.094-6.463s0.019-4.781 0.094-6.463c0.069-1.563 0.331-2.406 0.55-2.969 0.288-0.744 0.638-1.281 1.194-1.838 0.563-0.563 1.094-0.906 1.838-1.2 0.563-0.219 1.412-0.481 2.969-0.55 1.681-0.075 2.188-0.094 6.463-0.094zM16 0c-4.344 0-4.887 0.019-6.594 0.094-1.7 0.075-2.869 0.35-3.881 0.744-1.056 0.412-1.95 0.956-2.837 1.85-0.894 0.888-1.438 1.781-1.85 2.831-0.394 1.019-0.669 2.181-0.744 3.881-0.075 1.713-0.094 2.256-0.094 6.6s0.019 4.887 0.094 6.594c0.075 1.7 0.35 2.869 0.744 3.881 0.413 1.056 0.956 1.95 1.85 2.837 0.887 0.887 1.781 1.438 2.831 1.844 1.019 0.394 2.181 0.669 3.881 0.744 1.706 0.075 2.25 0.094 6.594 0.094s4.888-0.019 6.594-0.094c1.7-0.075 2.869-0.35 3.881-0.744 1.050-0.406 1.944-0.956 2.831-1.844s1.438-1.781 1.844-2.831c0.394-1.019 0.669-2.181 0.744-3.881 0.075-1.706 0.094-2.25 0.094-6.594s-0.019-4.887-0.094-6.594c-0.075-1.7-0.35-2.869-0.744-3.881-0.394-1.063-0.938-1.956-1.831-2.844-0.887-0.887-1.781-1.438-2.831-1.844-1.019-0.394-2.181-0.669-3.881-0.744-1.712-0.081-2.256-0.1-6.6-0.1v0z"></path>
  <path d="M16 7.781c-4.537 0-8.219 3.681-8.219 8.219s3.681 8.219 8.219 8.219 8.219-3.681 8.219-8.219c0-4.537-3.681-8.219-8.219-8.219zM16 21.331c-2.944 0-5.331-2.387-5.331-5.331s2.387-5.331 5.331-5.331c2.944 0 5.331 2.387 5.331 5.331s-2.387 5.331-5.331 5.331z"></path>
<path d="M26.462 7.456c0 1.060-0.859 1.919-1.919 1.919s-1.919-0.859-1.919-1.919c0-1.060 0.859-1.919 1.919-1.919s1.919 0.859 1.919 1.919z"></path>
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

  <li >
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
