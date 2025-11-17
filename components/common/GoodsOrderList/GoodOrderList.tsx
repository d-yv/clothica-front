import Image from 'next/image';
import { Good } from "@/types/good";
import styles from './GoodOrderList.module.css'


const GoodOrderList = ({ good }: { good: Good }) => {
    const  cartItem = false;
    return (
        <div >
            {!cartItem ?(
                <div> В козині нічого нема</div>
            ): (
                <div>
                    <Image  
                     src={good.image}
          alt={good.name}
          width={335}
          height={260}
          className={styles.image}
          priority />
                </div>
            )}
        </div>
    )
}
export default GoodOrderList