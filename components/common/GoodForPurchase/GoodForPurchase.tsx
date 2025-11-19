// import { Good } from "@/types/good";
// import css from "./GoodForPurchase.module.css";
// import Image from "next/image";

// export default function GoodForPurchase ({good}:{good:Good}) {

//   return (
//       <div className="container">
//           <div className={css.container}>
//               <div className={css.col}>
//                   <div className={css.imageWrap}>
//                       <Image
//                     src={good.image}
//                     alt={good.name}
//                     fill
//                     className={css.image}
//                   />
//                   </div>
//               </div>
//               <div className={css.col}>
//                   <h1 className={css.header}>{good.name}</h1>
//                   <p className={css.price}> {good.price.value} {good.price.currency} </p>
//                   <p className={css.about}>{good.prevDescription }</p>
//                   <button className={css.btn1}>Додати в кошик</button>
//                   <button className={css.btn2}>Купити зараз</button>
//                   <p className={css.text}>Безкоштовна доставка для замовлень від 1000 грн</p>
//                   <p>Опис</p>
//                   <p>{good.description}</p>
//                   <p>Основні характеристики</p>
//                   <p>{ good.characteristics}</p>
//               </div>

//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import css from "./GoodForPurchase.module.css";
import Image from "next/image";
import StarsIcon from "@/components/common/StarsIcon/StarsIcon";
import { Good, Size } from "@/types/good";
import { useShopStore } from "@/lib/store/cartStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductProps {
  good: Good;
}

export default function GoodForPurchase({ good }: ProductProps) {
  const [value, setValue] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<Size>(good.size[0] as Size);
  const [isToastVisible, setIsToastVisible] = useState(false);


  const addToCart = useShopStore((state) => state.addToCart);

  const router = useRouter();

  const handleAddToCart = () => {
    if (!good) return;
    const reviewsCount = good.feedbacks?.length ?? 0;
    addToCart({
      goodId: good._id,
      name: good.name,
      rate: good.averageRate,
      reviewsNumber: reviewsCount,
      price: good.price.value,
      amount: value,
      size: selectedSize,
      image: good.image,
      quantity: value,
    });

    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/order");
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.content}>
          <Image
            src={good.image}
            alt={good.name}
            width={335}
            height={337}
            className={css.image}
            priority
          />
          <div className={css.column}>
            <div className={css.productDescription}>
              {/* <p className={css.breadcrumbs}> Всі товари > Категорія >
                <span>{good.name}</span>
              </p> */}
              <nav className={css.navCrumbs}>
                <Link href="/goods">Всі товари</Link>
                <span>›</span>
                <span>Категорія</span>
                <span>›</span>
                <span>{good.name}</span>
              </nav>
              <h1 className={css.title}>{good.name}</h1>
              <div className={css.details}>
                <p className={css.price}>
                  {good.price.value} {good.price.currency}
                </p>
                <div className={css.verticalLine} />
                <div className={css.reviews}>
                  {good.feedbacks && good.feedbacks.length > 0 ? (
                    <>
                      <StarsIcon rating={good.averageRate} />
                      <Link href={`/goods/${good._id}#GoodReviews`}>
                        <span className={css.ratingText}>
                          ({good.averageRate}) • {good.feedbacks.length}{" "}
                          відгуків
                        </span>
                      </Link>
                    </>
                  ) : (
                    "Немає відгуків"
                  )}
                </div>
              </div>
              <p className={css.text}>{good.prevDescription}</p>
              <div className={css.sizeSelect}>
                <label className={css.label} htmlFor="selectSize">
                  Розмір
                </label>
                <select
                  className={css.size}
                  id="selectSize"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value as Size)}
                >
                  {good.size.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className={css.inputContainer}>
                <button className={css.addToBucket} onClick={handleAddToCart}>
                  Додати в кошик
                </button>
                <input
                  type="number"
                  min={1}
                  value={value || ""}
                  className={css.quantityInput}
                  onChange={(e) => setValue(Number(e.target.value))}
                ></input>
              </div>
            </div>
            <button className={css.buyNow} onClick={handleBuyNow}>
              Купити зараз
            </button>
            <p className={css.freeDelivery}>
              Безкоштовна доставка для замовлень від 1000грн
            </p>
            <div>
              <h2 className={css.descTitle}>Опис</h2>
              <p className={css.descText}>{good.description}</p>
              <p className={css.descSubtitle}>Основні характеристики</p>
              <ul className={css.listDisc}>
                {good.characteristics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={css.wrapper}>
        {isToastVisible && (
          <div className={css.successToast}>
            ✅ Товар **{good.name}** додано в кошик!
          </div>
        )}
      </div>
    </section>
  );
}
