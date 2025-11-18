import GoodForPurchase from "@/components/common/GoodForPurchase/GoodForPurchase";
import GoodReviews from "@/components/common/GoodReviews/GoodReviews";

export default async function GoodsDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1️⃣ Отримуємо товар
  const res = await fetch(
    `https://clothica-back.onrender.com/api/goods/${id}`,
    { next: { revalidate: 0 } }
  );
  const good = await res.json();

  // 2️⃣ Отримуємо відгуки
  const reviewsRes = await fetch(
    `https://clothica-back.onrender.com/api/feedbacks/product/${id}`,
    { next: { revalidate: 0 } }
  );
  const reviews = await reviewsRes.json();

  return (
    <div className="container">
      {/* Секція інформації про товар */}
      <GoodForPurchase good={good} />

      {/* Відступ перед секцією */}
      <div style={{ marginTop: "80px" }} />

      {/* Секція відгуків */}
      <GoodReviews reviews={reviews} goodId={id} />
    </div>
  );
}
