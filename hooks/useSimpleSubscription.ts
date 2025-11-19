'use client';

import { useState } from "react";
import React from "react";

interface SubscriptionResult {
  message: string;
  isSuccess: boolean;
}
export const useSimpleSubscription = () => {
  const [state, setState] = useState<SubscriptionResult>({ 
    message: '', 
    isSuccess: false 
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setState({ message: '', isSuccess: false });

    const form = e.currentTarget;
    const input = form.elements.namedItem("email") as HTMLInputElement | null;

    if (!input) return;

    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }

    const email = input.value.trim();

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setState({ message: "Ви успішно підписалися!", isSuccess: true });
        form.reset();
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.message || "Помилка підписки. Спробуйте інший email.";
        setState({ message: errorMessage, isSuccess: false });
      }
    } catch (error) {
      setState({ message: "Помилка мережі. З'єднання відсутнє.", isSuccess: false });
    }
  };

  return { state, handleSubmit };
};
