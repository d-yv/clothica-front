"use client";

import Link from "next/link";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
    isAuth: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isAuth, onClose }: MobileMenuProps) {
    return (
        <div className={`${styles.modal} ${styles.open}`}>
            <header className={styles.modalHeader}>
                <svg className={styles.logo} width="100" height="20">
                    <use href="/styles.icon.svg#icon-Clothica-1" />
                </svg>

                <div className={styles.rightSide}>
                    <button className={styles.headervector} onClick={onClose}>
                        <svg width="20" height="20">
                            <use href="/styles.icon.svg#icon-Vector" />
                        </svg>
                    </button>

                    {/* Исправлено: убран <button> внутри <Link> */}
                    <Link
                        href="/forms/CreateOrderForm"
                        onClick={onClose}
                        className={`${styles.cartBtn} ${styles.specialBtn}`}
                    >
                        <svg className={styles.headericon} width="24" height="24">
                            <use href="/styles.icon.svg#icon-shopping_cart" />
                        </svg>
                        <span className={styles.dot}></span>
                    </Link>
                </div>
            </header>

            <nav className={styles.mobileMenuList}>
                <Link href="/" onClick={onClose} className={styles.mobileMenuA}>
                    Головна
                </Link>
                <Link
                    href="/common/PopularGoods"
                    onClick={onClose}
                    className={styles.mobileMenuA}
                >
                    Товари
                </Link>
                <Link
                    href="/common/PopularCategories"
                    onClick={onClose}
                    className={styles.mobileMenuA}
                >
                    Категорії
                </Link>
            </nav>

            <div className={styles.headerAuth}>
                {!isAuth ? (
                    <>
                        <Link
                            href="/auth/login"
                            onClick={onClose}
                            className={`${styles.btnEntrance} ${styles.light}`}
                        >
                            Вхід
                        </Link>
                        <Link
                            href="/auth/register"
                            onClick={onClose}
                            className={styles.btnRegistration}
                        >
                            Реєстрація
                        </Link>
                    </>
                ) : (
                    <Link
                        href="/cabinet"
                        onClick={onClose}
                        className={styles.btnOfice}
                    >
                        Кабінет
                    </Link>
                )}
            </div>
        </div>
    );
}
