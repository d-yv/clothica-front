// components/MessageNoInfo/MessageNoInfo.tsx

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./MessageNoInfo.module.css";

interface MessageNoInfoProps {
  text: string;
  buttonText: string;
  route?: string; // '/goods' | '/categories'
  onClick?: () => void;
}

export default function MessageNoInfo({
  text,
  buttonText,
  route = "/goods",
  onClick,
}: MessageNoInfoProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // 🔥 тут ВИКЛИКАЄМО твою логіку модалки
    } else {
      router.push(route); // 🔥 fallback — як раніше
    }
  };

  return (
    <div className={styles.message_wrapper}>
      <div className={styles.message_container}>
        <p className={styles.message_text}>{text}</p>
        <button onClick={handleClick} className={styles.message_button}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
