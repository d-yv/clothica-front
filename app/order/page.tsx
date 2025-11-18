import CreateOrderForm from '@/components/forms/CreateOrderForm/CreateOrderForm';
import GoodOrderList from '@/components/common/GoodsOrderList/GoodOrderList';
import styles from './CreateOrderPage.module.css';

export default function CreateOrderPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Оформити замовлення</h1>
      
      {/* Добавляем обертку orderContent для десктопной версии */}
      <div className={styles.orderContent}>
        <section className={styles.goodsSection}>
          <GoodOrderList />
        </section>

        <section className={styles.formSection}>
          <CreateOrderForm />
        </section>
      </div>
    </div>
  );
}