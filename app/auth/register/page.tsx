import RegistrationForm from '@/components/forms/RegistrationForm/RegistrationForm';
import Link from 'next/link';
import styles from './page.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header with logo only */}
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <img 
              src="/images/auth/logo.svg" 
              alt="Clothica" 
              className={styles.logo}
            />
          </div>
        </div>

        {/* Form content with tabs */}
        <div className={styles.formContent}>
          <div className={styles.tabs}>
            <Link href="/auth/register" className={`${styles.tab} ${styles.activeTab}`}>
              Реєстрація
            </Link>
            <Link href="/auth/login" className={styles.tab}>
              Вхід
            </Link>
          </div>
          
          <h2 className={styles.formTitle}>Реєстрація</h2>
          <RegistrationForm />
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