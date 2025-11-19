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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
