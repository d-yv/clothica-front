import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.hero_content}>
           <div>
          <h1 id="hero-title" className={styles.hero_title}>
            Знайди свій стиль з Clothica вже сьогодні!
          </h1>

          <p className={styles.hero_text}>
            Clothica — це місце, де комфорт поєднується зі стилем. Ми створюємо базовий одяг, який легко комбінується та підходить для будь-якої нагоди. Обирай речі, що підкреслять твою індивідуальність і завжди будуть актуальними.
          </p>
          </div>
          <div className={styles.hero_links}>
            {/* Якір на секцію-компонент PopularGoods */}
            <Link href="#PopularGoods" className={styles.link_primary}>
              До товарів
            </Link>

            {/* Якір на секцію-компонент PopularCategories */}
            <Link href="#PopularCategories" className={styles.link_secondary}>
              Дослідити категорії
            </Link>
          </div>
        </div>

        <div>
      <picture>
            <source
              media="(min-width: 1440px)"
              srcSet="/images/hero/hero-desktop.png 1x, /images/hero/hero-desktop@2x.png 2x"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/images/hero/hero-tablet.png 1x, /images/hero/hero-tablet@2x.png 2x"
            />
            <img
              src="/images/hero/hero-mobile.png"
              srcSet="/images/hero/hero-mobile.png 1x, /images/hero/hero-mobile@2x.png 2x"
              alt="Молода пара в базовому одязі Clothica"
              className={styles.hero_image}
        />
      </picture>
        </div>
      </div>
    </section>
  );
}