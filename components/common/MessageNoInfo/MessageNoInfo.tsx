"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./MessageNoInfo.module.css";

export type Variant = "emptyCart" | "noProducts" | "noReviews";

interface MessageNoInfoProps {
    variant?: Variant;
    text?: string;
    buttonText?: string;
    route?: string;
}

interface Message {
    text: string;
    buttonText: string;
    route: string;
}

export default function MessageNoInfo({
    variant = "noProducts",
    text,
    buttonText,
    route,
}: MessageNoInfoProps) {
    const router = useRouter();

    const messages: Record<Variant, Message> = {
        emptyCart: { text: "Ваш кошик порожній, мершій до покупок!", buttonText: "До покупок", route: "/goods" },
        noProducts: { text: "За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх.", buttonText: "Скинути фільтри", route: "/categories" },
        noReviews: { text: "У цього товару ще немає відгуків", buttonText: "Залишити відгук", route: "/goods" },
    };

    const { text: defaultText, buttonText: defaultButton, route: defaultRoute } = messages[variant];
    const finalText = text ?? defaultText;
    const finalButton = buttonText ?? defaultButton;
    const finalRoute = route ?? defaultRoute;

    const handleClick = () => router.push(finalRoute);

    return (
        <div className={styles.messagenoinfo}>
            <p className={styles.messagenoinfotext}>{finalText}</p>
            {finalButton && (
                <button onClick={handleClick} className={styles.messagenoinfobutton}>
                    {finalButton}
                </button>
            )}
        </div>
    );
}
