'use client'

import React from "react";
import styles from  "./Footer.module.css";
import Link from "next/link";
import Image from 'next/image';
import Logo from '../../../public/icons/logo.svg';


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
          <Image src={Logo} alt="Logo company" className={styles.logo} />
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
        <li>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <img src="/icons/facebook.svg" alt="Facebook" className={styles.icon} />
          </a>
        </li>

        <li>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img src="/icons/instagram.svg" alt="Instagram" className={styles.icon} />
          </a>
        </li>

        <li>
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <img src="/icons/x.svg" alt="X" className={styles.icon} />
          </a>
        </li>

        <li>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <img src="/icons/youtube.svg" alt="YouTube" className={styles.icon} />
          </a>
        </li>
      </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
