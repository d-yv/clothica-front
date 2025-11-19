"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import css from "./GoodPage.module.css";
import GoodForPurchase from "@/components/common/GoodForPurchase/GoodForPurchase";
import Loading from "@/app/loading";
import { api } from "@/app/api/api";
import GoodReviews from "@/components/common/GoodReviews/GoodReviews";
import type { Feedback } from "@/types/feedback";
export const fetchGoodById = async (goodId: string) => {
  if (!goodId) throw new Error("Missing goodId");
  return api.get(`/goods/${goodId}`);
};
export default function GoodPageWrapper() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <GoodPage />
    </QueryClientProvider>
  );
}
function GoodPage() {
  const { goodId } = useParams<{ goodId: string }>();
  const {
    data: good,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["good", goodId],
    queryFn: () => fetchGoodById(goodId).then((res) => res.data),
    enabled: !!goodId,
  });

  const { data: feedbacks } = useQuery({
    queryKey: ["feedbacks", goodId],
    queryFn: () => api.get(`/feedbacks/${goodId}`).then((res) => res.data),
    enabled: !!goodId,
  });
  const averageRate =
    feedbacks && feedbacks.length > 0
      ? feedbacks.reduce((sum: number, fb: Feedback) => sum + fb.rate, 0) /
        feedbacks.length
      : 0;

  const feedbackCount = feedbacks?.length ?? 0;
  if (!goodId) return <div>Помилка: goodId не отримано</div>;
  if (isLoading) return <Loading />;
  if (isError || !good) return <div>Товар не знайдено</div>;
  const fullGood = {
    ...good,
    averageRate,
    feedbackCount,
    feedbacks,
  };

  return (
    <div className={css.section}>
      <GoodForPurchase good={fullGood} />
      <GoodReviews goodId={goodId} />
    </div>
  );
}
