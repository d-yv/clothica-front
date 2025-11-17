import GoodForPurchase from "@/components/common/GoodForPurchase/GoodForPurchase";

export default async function GoodsDetails({ params }:{params:Promise<{id:string}>}) {
    const { id } = await params;
    const res = await fetch(`http://clothica-back.onrender.com/api/goods/${id}`)
    const good = await res.json()
  return (
    <div className="container">
          <GoodForPurchase good={good} /> 
    </div>
  );
}