"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FormikProps,
} from "formik";
import * as Yup from "yup";
import { createOrder, CreateOrderRequest } from "@/lib/api";
import { useShopStore } from "@/lib/store/cartStore";
import styles from "./CreateOrderForm.module.css";

interface UserProfileData {
  _id?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  city?: string;
  postOfficeNum?: string;
}

interface OrderFormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  novaPoshtaBranch: string;
  comment: string;
}

const OrderSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Мінімум 2 символи")
    .required("Обов'язкове поле"),
  lastName: Yup.string()
    .min(2, "Мінімум 2 символи")
    .required("Обов'язкове поле"),
  phone: Yup.string()
    .test("phone-format", "Невірний формат", (value) => {
      if (!value) return false;
      const digitsOnly = value.replace(/[^\d+]/g, "");
      // Валідація залишається як у вашому коді
      return /^\+38\d{10}$/.test(digitsOnly);
    })
    .required("Обов'язкове поле"),
  city: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
  novaPoshtaBranch: Yup.string().required("Обов'язкове поле"),
  comment: Yup.string().optional(),
});

const fetchCurrentUser = async (): Promise<UserProfileData | null> => {
  try {
    const res = await fetch("/api/user", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      const errorData = await res.json();
      throw new Error(
        errorData.message || `Failed to fetch user data: ${res.status}`
      );
    }

    return res.json();
  } catch (error: unknown) {
    console.error("Error in fetchCurrentUser:", error);

    return null;
  }
};

/**
 * Ваша оригінальна логіка форматування телефону.
 */
const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.startsWith("38")) return "+" + numbers;
  if (numbers.length === 0) return "";
  if (numbers.length <= 3) return `+38 (${numbers}`;
  if (numbers.length <= 6)
    return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  if (numbers.length <= 8)
    return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(
      6
    )}`;
  return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(
    6,
    8
  )}.${numbers.slice(8, 10)}`;
};

interface ApiErrorWithValidation {
  response?: {
    data?: {
      validation?: {
        body?: Record<string, unknown>;
      };
      message?: string;
    };
    status?: number;
  };
}

function isApiErrorWithValidation(
  error: unknown
): error is ApiErrorWithValidation {
  return typeof error === "object" && error !== null && "response" in error;
}

export default function CreateOrderForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>("");
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { cartItems, clearCart } = useShopStore();

  const getInitialValues = (): OrderFormData => {
    // Форматування для відображення
    const phone =
      isAuthenticated && userData?.phone
        ? formatPhoneNumber(userData.phone)
        : "";

    if (isAuthenticated && userData) {
      return {
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: phone, // Використовуємо форматований номер
        city: userData.city || "",
        novaPoshtaBranch: userData.postOfficeNum || "",
        comment: "",
      };
    }

    return {
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      novaPoshtaBranch: "",
      comment: "",
    };
  };

  useEffect(() => {
    const loadUserData = async (): Promise<void> => {
      try {
        const data = await fetchCurrentUser();

        if (data) {
          setUserData(data);
          setIsAuthenticated(true);
        } else {
          setUserData(null);
          setIsAuthenticated(false);
        }
      } catch (error: unknown) {
        console.error("❌ [USER] Ошибка загрузки данных:", error);
        setUserData(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async (
    values: OrderFormData,
    { setSubmitting }: FormikHelpers<OrderFormData>
  ) => {
    try {
      setSubmitError("");

      if (cartItems.length === 0) {
        setSubmitError(
          "Кошик порожній. Додайте товари перед оформленням замовлення."
        );
        setSubmitting(false);
        return;
      }

      // Використовуємо вашу оригінальну логіку очищення (видалення не-цифр).
      const phoneForSubmit = values.phone.replace(/\D/g, "");

      const orderData: CreateOrderRequest = {
        cart: cartItems.map((item) => ({
          goodId: item.goodId,
          size: item.size || "M",
          amount: item.amount,
          pricePerItem: item.price,
        })),
        status: "У процесі",
        userData: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: phoneForSubmit,
          city: values.city,
          postOfficeNum: values.novaPoshtaBranch,
          comment: values.comment || "",
        },
      };

      // Додано: Виведення json у консоль
      console.log(
        "📦 [ORDER PAYLOAD] JSON, що відправляється:",
        JSON.stringify(orderData, null, 2)
      );

      const result = await createOrder(orderData);

      console.log("✅ [ORDER] Замовлення успішно створено:", result);

      clearCart();
      router.push("/goods");
    } catch (error: unknown) {
      console.error("❌ [ORDER] Помилка створення замовлення:", error);

      if (isApiErrorWithValidation(error)) {
        const validationError = error.response?.data?.validation?.body;

        if (validationError) {
          const validationMessage =
            error.response?.data?.message || "Невірні дані";
          setSubmitError(`Помилка валідації: ${validationMessage}`);
        } else {
          setSubmitError("Помилка створення замовлення. Спробуйте ще раз.");
        }
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Помилка створення замовлення. Спробуйте ще раз.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`${styles.container} p-6 flex justify-center items-center h-48`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-4 text-gray-700">Завантаження даних...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.subtitle}>Особиста інформація</h3>
      {submitError && <div className={styles.errorText}>{submitError}</div>}

      <Formik
        initialValues={getInitialValues()}
        validationSchema={OrderSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({
          isSubmitting,
          setFieldValue,
          values,
          errors,
          touched,
          isValid,
        }: FormikProps<OrderFormData>) => {
          // Видалено проблемний рядок. Використовуємо isValid від Formik.
          // const hasValidationErrors = Object.keys(errors).some(key => errors[key] && touched[key]);

          const allRequiredFieldsFilled =
            values.firstName &&
            values.lastName &&
            values.phone &&
            values.city &&
            values.novaPoshtaBranch;

          // Тепер кнопка заблокована, якщо:
          // 1. Кошик порожній.
          // 2. Форма відправляється.
          // 3. Форма не є валідною (Formik's isValid === false).
          // 4. Не всі обов'язкові поля заповнені (на випадок, якщо isValid спрацює не одразу).
          const isButtonDisabled =
            cartItems.length === 0 ||
            isSubmitting ||
            !isValid ||
            !allRequiredFieldsFilled;

          return (
            <Form className={styles.form}>
              <div className={styles.nameRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Ім&apos;я*</label>
                  <Field
                    type="text"
                    name="firstName"
                    className={`${styles.input} ${
                      errors.firstName && touched.firstName
                        ? styles.inputError
                        : ""
                    }`}
                    placeholder="Ім'я"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className={styles.errorText}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Прізвище*</label>
                  <Field
                    type="text"
                    name="lastName"
                    className={`${styles.input} ${
                      errors.lastName && touched.lastName
                        ? styles.inputError
                        : ""
                    }`}
                    placeholder="Прізвище"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className={styles.errorText}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Телефон*</label>
                <Field
                  type="tel"
                  name="phone"
                  className={`${styles.input} ${
                    errors.phone && touched.phone ? styles.inputError : ""
                  }`}
                  placeholder="+38 (0__) __.__.__"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFieldValue("phone", formatted);
                  }}
                  value={values.phone}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className={styles.errorText}
                />
              </div>

              <div className={styles.nameRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Місто доставки*</label>
                  <Field
                    type="text"
                    name="city"
                    className={`${styles.input} ${
                      errors.city && touched.city ? styles.inputError : ""
                    }`}
                    placeholder="Ваше місто"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className={styles.errorText}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Номер відділення Нової Пошти*
                  </label>
                  <Field
                    type="text"
                    name="novaPoshtaBranch"
                    className={`${styles.input} ${
                      errors.novaPoshtaBranch && touched.novaPoshtaBranch
                        ? styles.inputError
                        : ""
                    }`}
                    placeholder="1"
                  />
                  <ErrorMessage
                    name="novaPoshtaBranch"
                    component="div"
                    className={styles.errorText}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Коментар</label>
                <Field
                  as="textarea"
                  name="comment"
                  className={styles.textarea}
                  placeholder="Коментар"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                className={styles.button}
              >
                {isSubmitting ? "Відправка..." : "Оформити замовлення"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

// // components/forms/CreateOrderForm/CreateOrderForm.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Formik,
//   Form,
//   Field,
//   ErrorMessage,
//   FormikHelpers,
//   FormikProps,
// } from "formik";
// import * as Yup from "yup";
// import { createOrder, CreateOrderRequest } from "@/lib/api";
// import { useShopStore } from "@/lib/store/cartStore";
// import styles from "./CreateOrderForm.module.css";

// interface UserProfileData {
//   _id?: string;
//   firstName: string;
//   lastName?: string;
//   phone?: string;
//   city?: string;
//   postOfficeNum?: string;
// }

// interface OrderFormData {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   city: string;
//   postOfficeNum: string;
//   comment: string;
// }

// const OrderSchema = Yup.object().shape({
//   firstName: Yup.string()
//     .min(2, "Мінімум 2 символи")
//     .required("Обов'язкове поле"),
//   lastName: Yup.string()
//     .min(2, "Мінімум 2 символи")
//     .required("Обов'язкове поле"),
//   phone: Yup.string()
//     .test("phone-format", "Невірний формат", (value) => {
//       if (!value) return false;
//       const digitsOnly = value.replace(/[^\d+]/g, "");
//       return /^\+38\d{10}$/.test(digitsOnly);
//     })
//     .required("Обов'язкове поле"),
//   city: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
//   postOfficeNum: Yup.string().required("Обов'язкове поле"),
// });

// const fetchCurrentUser = async (): Promise<UserProfileData | null> => {
//   try {
//     const res = await fetch("/api/user", {
//       method: "GET",
//       credentials: "include",
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       if (res.status === 401) {
//         return null;
//       }
//       const errorData = await res.json();
//       throw new Error(
//         errorData.message || `Failed to fetch user data: ${res.status}`
//       );
//     }

//     return res.json();
//   } catch (error: unknown) {
//     console.error("Error in fetchCurrentUser:", error);

//     return null;
//   }
// };

// const formatPhoneNumber = (value: string): string => {
//   const numbers = value.replace(/\D/g, "");
//   if (numbers.startsWith("38")) return "+" + numbers;
//   if (numbers.length === 0) return "";
//   if (numbers.length <= 3) return `+38 (${numbers}`;
//   if (numbers.length <= 6)
//     return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
//   if (numbers.length <= 8)
//     return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(
//       6
//     )}`;
//   return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(
//     6,
//     8
//   )}.${numbers.slice(8, 10)}`;
// };

// interface ApiErrorWithValidation {
//   response?: {
//     data?: {
//       validation?: {
//         body?: Record<string, unknown>;
//       };
//     };
//     status?: number;
//   };
// }

// function isApiErrorWithValidation(
//   error: unknown
// ): error is ApiErrorWithValidation {
//   return typeof error === "object" && error !== null && "response" in error;
// }

// export default function CreateOrderForm() {
//   const router = useRouter();
//   const [submitError, setSubmitError] = useState<string>("");
//   const [userData, setUserData] = useState<UserProfileData | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   const { cartItems, clearCart } = useShopStore();

//   const getInitialValues = (): OrderFormData => {
//     if (isAuthenticated && userData) {
//       return {
//         firstName: userData.firstName || "",
//         lastName: userData.lastName || "",
//         phone: userData.phone || "",
//         city: userData.city || "",
//         postOfficeNum: userData.postOfficeNum || "",
//         comment: "",
//       };
//     }

//     return {
//       firstName: "",
//       lastName: "",
//       phone: "",
//       city: "",
//       postOfficeNum: "",
//       comment: "",
//     };
//   };

//   useEffect(() => {
//     const loadUserData = async (): Promise<void> => {
//       try {
//         const data = await fetchCurrentUser();

//         if (data) {
//           setUserData(data);
//           setIsAuthenticated(true);
//         } else {
//           setUserData(null);
//           setIsAuthenticated(false);
//         }
//       } catch (error: unknown) {
//         console.error("❌ [USER] Ошибка загрузки данных:", error);
//         setUserData(null);
//         setIsAuthenticated(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadUserData();
//   }, []);

//   const handleSubmit = async (
//     values: OrderFormData,
//     { setSubmitting }: FormikHelpers<OrderFormData>
//   ) => {
//     try {
//       setSubmitError("");

//       if (cartItems.length === 0) {
//         setSubmitError(
//           "Кошик порожній. Додайте товари перед оформленням замовлення."
//         );
//         setSubmitting(false);
//         return;
//       }

//       const orderData: CreateOrderRequest = {
//         cart: cartItems.map((item) => ({
//           goodId: item.goodId,
//           size: item.size || "M",
//           amount: item.amount,
//           pricePerItem: item.price,
//         })),
//         status: "У процесі",
//         userData: {
//           firstName: values.firstName,
//           lastName: values.lastName,
//           phone: values.phone.replace(/\D/g, ""),
//           city: values.city,
//           postOfficeNum: values.postOfficeNum,
//           comment: values.comment || "",
//         },
//       };

//       const result = await createOrder(orderData);

//       console.log("✅ [ORDER] Заказ успешно создан:", result);

//       clearCart();
//       router.push("/goods");
//     } catch (error: unknown) {
//       console.error("❌ [ORDER] Ошибка создания заказа:", error);

//       if (isApiErrorWithValidation(error)) {
//         const validationError = error.response?.data?.validation?.body;

//         if (validationError) {
//           const validationMessage = validationError.message || "Невірні дані";
//           setSubmitError(`Помилка валідації: ${validationMessage}`);
//         } else {
//           setSubmitError("Помилка створення замовлення. Спробуйте ще раз.");
//         }
//       } else if (error instanceof Error) {
//         setSubmitError(error.message);
//       } else {
//         setSubmitError("Помилка створення замовлення. Спробуйте ще раз.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return <div className={styles.loading}>Завантаження даних...</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <h3 className={styles.subtitle}>Особиста інформація</h3>
//       {submitError && <div className={styles.errorText}>{submitError}</div>}

//       <Formik
//         initialValues={getInitialValues()}
//         validationSchema={OrderSchema}
//         onSubmit={handleSubmit}
//         enableReinitialize={true}
//       >
//         {({
//           isSubmitting,
//           setFieldValue,
//           values,
//           errors,
//         }: FormikProps<OrderFormData>) => {
//           const hasValidationErrors = Object.keys(errors).length > 0;
//           const allRequiredFieldsFilled =
//             values.firstName &&
//             values.lastName &&
//             values.phone &&
//             values.city &&
//             values.postOfficeNum;

//           const isButtonDisabled =
//             cartItems.length === 0 ||
//             isSubmitting ||
//             hasValidationErrors ||
//             !allRequiredFieldsFilled;

//           return (
//             <Form className={styles.form}>
//               <div className={styles.nameRow}>
//                 <div className={styles.field}>
//                   <label className={styles.label}>Ім&apos;я*</label>
//                   <Field
//                     type="text"
//                     name="firstName"
//                     className={styles.input}
//                     placeholder="Ім'я"
//                   />
//                   <ErrorMessage
//                     name="firstName"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>

//                 <div className={styles.field}>
//                   <label className={styles.label}>Прізвище*</label>
//                   <Field
//                     type="text"
//                     name="lastName"
//                     className={styles.input}
//                     placeholder="Прізвище"
//                   />
//                   <ErrorMessage
//                     name="lastName"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>
//               </div>

//               <div className={styles.field}>
//                 <label className={styles.label}>Телефон*</label>
//                 <Field
//                   type="tel"
//                   name="phone"
//                   className={styles.input}
//                   placeholder="+38 (0__) __.__.__"
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     const formatted = formatPhoneNumber(e.target.value);
//                     setFieldValue("phone", formatted);
//                   }}
//                   value={values.phone}
//                 />
//                 <ErrorMessage
//                   name="phone"
//                   component="div"
//                   className={styles.errorText}
//                 />
//               </div>

//               <div className={styles.nameRow}>
//                 <div className={styles.field}>
//                   <label className={styles.label}>Місто доставки*</label>
//                   <Field
//                     type="text"
//                     name="city"
//                     className={styles.input}
//                     placeholder="Ваше місто"
//                   />
//                   <ErrorMessage
//                     name="city"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>

//                 <div className={styles.field}>
//                   <label className={styles.label}>
//                     Номер відділення Нової Пошти*
//                   </label>
//                   <Field
//                     type="text"
//                     name="postOfficeNum"
//                     className={styles.input}
//                     placeholder="1"
//                   />
//                   <ErrorMessage
//                     name="postOfficeNum"
//                     component="div"
//                     className={styles.errorText}
//                   />
//                 </div>
//               </div>

//               <div className={styles.field}>
//                 <label className={styles.label}>Коментар</label>
//                 <Field
//                   as="textarea"
//                   name="comment"
//                   className={styles.textarea}
//                   placeholder="Коментар"
//                   rows={4}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isButtonDisabled}
//                 className={styles.button}
//               >
//                 {isSubmitting ? "Відправка..." : "Оформити замовлення"}
//               </button>
//             </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// }
