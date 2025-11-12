//app/auth/login/page.tsx

import LoginForm from '@/components/forms/LoginForm/LoginForm';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header with logo only */}
        <div className={styles.header}>
          <div className={styles.logoSection}>
            {/* Оборачиваем логотип в Link для кликабельности */}
            <Link href="/"> {/* href="/" - ссылка на главную страницу */}
              <img 
                src="/images/auth/logo.svg" 
                alt="Clothica" 
                className={styles.logo}
              />
            </Link>
          </div>
        </div>

        {/* Form content with tabs */}
        <div className={styles.formContent}>
          <div className={styles.tabs}>
            <Link href="/auth/register" className={styles.tab}>
              Реєстрація
            </Link>
            <Link href="/auth/login" className={`${styles.tab} ${styles.activeTab}`}>
              Вхід
            </Link>
          </div>
          
          <h2 className={styles.formTitle}>Вхід</h2>
          <LoginForm />
        </div>

        {/* Footer with copyright */}
        <div className={styles.footer}>
          <div className={styles.copyright}>
            © 2025 Clothica. Всі права захищені.
          </div>
        </div>
      </div>
    </div>
  );
}