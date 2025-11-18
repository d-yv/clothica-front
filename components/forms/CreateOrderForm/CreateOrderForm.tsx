//components/forms/CreateOrderForm/CreateOrderForm.tsx


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
// import * as Yup from 'yup';
// import styles from './CreateOrderForm.module.css';

// // Тип для формы заказа
// type OrderFormValues = {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   city: string;
//   novaPoshtaBranch: string;
//   comment: string;
// };

// // Схема валидации Yup
// const OrderSchema = Yup.object().shape({
//   firstName: Yup.string()
//     .min(2, "Ім'я повинно містити мінімум 2 символи")
//     .required("Обов'язкове поле"),
//   lastName: Yup.string()
//     .min(2, "Прізвище повинно містити мінімум 2 символи")
//     .required("Обов'язкове поле"),
//   phone: Yup.string()
//     .test('phone-format', 'Невірний формат телефону', (value) => {
//       if (!value) return false;
//       const digitsOnly = value.replace(/[^\d+]/g, '');
//       return /^\+38\d{10}$/.test(digitsOnly);
//     })
//     .required("Обов'язкове поле"),
//   city: Yup.string()
//     .min(2, 'Назва міста повинна містити мінімум 2 символи')
//     .required("Обов'язкове поле"),
//   novaPoshtaBranch: Yup.string()
//     .required("Обов'язкове поле"),
// });

// // Функция для форматирования номера телефона
// const formatPhoneNumber = (value: string) => {
//   const numbers = value.replace(/\D/g, '');
  
//   if (numbers.startsWith('38')) {
//     return '+' + numbers;
//   }
  
//   if (numbers.length === 0) return '';
//   if (numbers.length <= 3) return `+38 (${numbers}`;
//   if (numbers.length <= 6) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
//   if (numbers.length <= 8) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
//   return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 8)}-${numbers.slice(8, 10)}`;
// };

// const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//   if (!/[0-9+\-()\s]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Escape|Home|End|PageUp|PageDown/.test(e.key)) {
//     e.preventDefault();
//   }
// };

// export function CreateOrderForm() {
//   const router = useRouter();
//   const [error, setError] = useState('');

//   const initialValues: OrderFormValues = {
//     firstName: '',
//     lastName: '',
//     phone: '',
//     city: '',
//     novaPoshtaBranch: '',
//     comment: '',
//   };

//   const handleSubmit = async (
//     values: OrderFormValues,
//     { setSubmitting }: FormikHelpers<OrderFormValues>
//   ) => {
//     try {
//       setError('');
//       console.log('Sending order data:', values);
      
//       // TODO: Заменить на реальный API вызов для создания заказа
//       // const res = await createOrder(values);
      
//       // Временная заглушка
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       console.log('Order created successfully');
      
//       // Успешное создание заказа - переход на страницу товаров
//       router.push('/goods');
      
//     } catch (error: unknown) {
//       console.error('Order creation error:', error);
      
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('Помилка створення замовлення. Спробуйте ще раз.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {error && (
//         <div className={styles.errorText}>
//           {error}
//         </div>
//       )}
      
//       <Formik
//         initialValues={initialValues}
//         validationSchema={OrderSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting, errors, touched, setFieldValue, values }) => (
//           <Form className={styles.form}>
//             <div className={styles.nameRow}>
//               <div className={styles.field}>
//                 <label htmlFor="firstName" className={styles.label}>
//                   Ім&apos;я*
//                 </label>
//                 <Field
//                   type="text"
//                   id="firstName"
//                   name="firstName"
//                   className={`${styles.input} ${
//                     touched.firstName && errors.firstName ? styles.inputError : ''
//                   }`}
//                   placeholder="Ваше ім'я"
//                 />
//                 <ErrorMessage name="firstName" component="div" className={styles.errorText} />
//               </div>

//               <div className={styles.field}>
//                 <label htmlFor="lastName" className={styles.label}>
//                   Прізвище*
//                 </label>
//                 <Field
//                   type="text"
//                   id="lastName"
//                   name="lastName"
//                   className={`${styles.input} ${
//                     touched.lastName && errors.lastName ? styles.inputError : ''
//                   }`}
//                   placeholder="Ваше прізвище"
//                 />
//                 <ErrorMessage name="lastName" component="div" className={styles.errorText} />
//               </div>
//             </div>

//             <div className={styles.field}>
//               <label htmlFor="phone" className={styles.label}>
//                 Номер телефону*
//               </label>
//               <Field
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 className={`${styles.input} ${
//                   touched.phone && errors.phone ? styles.inputError : ''
//                 }`}
//                 placeholder="+38 (0__) __-__-__"
//                 onKeyPress={handleKeyPress}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                   const formatted = formatPhoneNumber(e.target.value);
//                   setFieldValue('phone', formatted);
//                 }}
//                 value={values.phone}
//               />
//               <ErrorMessage name="phone" component="div" className={styles.errorText} />
//               <div className={styles.phoneHint}>
//                 Формат: +38 (0XX) XXX-XX-XX
//               </div>
//             </div>

//             <div className={styles.field}>
//               <label htmlFor="city" className={styles.label}>
//                 Місто доставки*
//               </label>
//               <Field
//                 type="text"
//                 id="city"
//                 name="city"
//                 className={`${styles.input} ${
//                   touched.city && errors.city ? styles.inputError : ''
//                 }`}
//                 placeholder="Ваше місто"
//               />
//               <ErrorMessage name="city" component="div" className={styles.errorText} />
//             </div>

//             <div className={styles.field}>
//               <label htmlFor="novaPoshtaBranch" className={styles.label}>
//                 Номер відділення Нової Пошти*
//               </label>
//               <Field
//                 type="text"
//                 id="novaPoshtaBranch"
//                 name="novaPoshtaBranch"
//                 className={`${styles.input} ${
//                   touched.novaPoshtaBranch && errors.novaPoshtaBranch ? styles.inputError : ''
//                 }`}
//                 placeholder="1"
//               />
//               <ErrorMessage name="novaPoshtaBranch" component="div" className={styles.errorText} />
//             </div>

//             <div className={styles.field}>
//               <label htmlFor="comment" className={styles.label}>
//                 Коментар
//               </label>
//               <Field
//                 as="textarea"
//                 id="comment"
//                 name="comment"
//                 className={styles.textarea}
//                 placeholder="Введіть ваш коментар"
//                 rows={4}
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={styles.button}
//             >
//               {isSubmitting ? 'Відправка...' : 'Оформити замовлення'}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }


// import { createOrder } from '@/lib/api';
// import { useShopStore } from '@/lib/store/cartStore';
// import styles from './CreateOrderForm.module.css';
// Ім&apos;я*






// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { createOrder } from '@/lib/api';
// import { useShopStore } from '@/lib/store/cartStore';
// import { useAuthStore } from '@/lib/store/authStore';
// import styles from './CreateOrderForm.module.css';

// interface UserData {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   city: string;
//   postOfficeNum: string;
// }

// const OrderSchema = Yup.object().shape({
//   firstName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
//   lastName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
//   phone: Yup.string()
//     .test('phone-format', 'Невірний формат', (value) => {
//       if (!value) return false;
//       const digitsOnly = value.replace(/[^\d+]/g, '');
//       return /^\+38\d{10}$/.test(digitsOnly);
//     })
//     .required("Обов'язкове поле"),
//   city: Yup.string().min(2, 'Мінімум 2 символи').required("Обов'язкове поле"),
//   novaPoshtaBranch: Yup.string().required("Обов'язкове поле"),
// });

// const formatPhoneNumber = (value: string) => {
//   const numbers = value.replace(/\D/g, '');
//   if (numbers.startsWith('38')) return '+' + numbers;
//   if (numbers.length === 0) return '';
//   if (numbers.length <= 3) return `+38 (${numbers}`;
//   if (numbers.length <= 6) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
//   if (numbers.length <= 8) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(6)}`;
//   return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(6, 8)}.${numbers.slice(8, 10)}`;
// };

// export default function CreateOrderForm() {
//   const router = useRouter();
//   const [error, setError] = useState('');
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const { cartItems, clearCart } = useShopStore();
//   const { isAuthenticated, token } = useAuthStore();

//   useEffect(() => {
//     const loadUserData = async () => {
//       if (!isAuthenticated || !token) return;
      
//       try {
//         const response = await fetch('https://clothica-back.onrender.com/api/users/me', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUserData(data);
//         }
//       } catch (error) {
//         console.error('Помилка завантаження даних:', error);
//       }
//     };

//     loadUserData();
//   }, [isAuthenticated, token]);

//   if (cartItems.length === 0) {
//     return (
//       <div className={styles.emptyCart}>
//         <p>Кошик порожній</p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {error && <div className={styles.errorText}>{error}</div>}
      
//       <Formik
//         initialValues={{
//           firstName: userData?.firstName || '',
//           lastName: userData?.lastName || '',
//           phone: userData?.phone || '',
//           city: userData?.city || '',
//           novaPoshtaBranch: userData?.postOfficeNum || '',
//           comment: '',
//         }}
//         validationSchema={OrderSchema}
//         onSubmit={async (values, { setSubmitting }) => {
//           try {
//             setError('');
            
//             const orderItems = cartItems.map(item => ({
//               productId: item.goodId,
//               quantity: item.amount,
//               price: item.price,
//             }));
            
//             await createOrder({
//               ...values,
//               items: orderItems,
//             });
            
//             clearCart();
//             router.push('/goods');
            
//           } catch (error: unknown) {
//             if (error instanceof Error) {
//               setError(error.message);
//             } else {
//               setError('Помилка створення замовлення');
//             }
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ isSubmitting, setFieldValue, values }) => (
//           <Form className={styles.form}>
//             <div className={styles.nameRow}>
//               <div className={styles.field}>
//                 <label className={styles.label}>Ім&apos;я*</label>
//                 <Field type="text" name="firstName" className={styles.input} placeholder="Ім'я" />
//                 <ErrorMessage name="firstName" component="div" className={styles.errorText} />
//               </div>

//               <div className={styles.field}>
//                 <label className={styles.label}>Прізвище*</label>
//                 <Field type="text" name="lastName" className={styles.input} placeholder="Прізвище" />
//                 <ErrorMessage name="lastName" component="div" className={styles.errorText} />
//               </div>
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>Телефон*</label>
//               <Field
//                 type="tel"
//                 name="phone"
//                 className={styles.input}
//                 placeholder="+38 (0__) __.__.__"
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                   const formatted = formatPhoneNumber(e.target.value);
//                   setFieldValue('phone', formatted);
//                 }}
//                 value={values.phone}
//               />
//               <ErrorMessage name="phone" component="div" className={styles.errorText} />
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>Місто*</label>
//               <Field type="text" name="city" className={styles.input} placeholder="Місто" />
//               <ErrorMessage name="city" component="div" className={styles.errorText} />
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>Відділення НП*</label>
//               <Field type="text" name="novaPoshtaBranch" className={styles.input} placeholder="1" />
//               <ErrorMessage name="novaPoshtaBranch" component="div" className={styles.errorText} />
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>Коментар</label>
//               <Field as="textarea" name="comment" className={styles.textarea} placeholder="Коментар" rows={4} />
//             </div>

//             <button type="submit" disabled={isSubmitting} className={styles.button}>
//               {isSubmitting ? 'Відправка...' : 'Оформити замовлення'}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { createOrder } from '@/lib/api';
// import { useShopStore } from '@/lib/store/cartStore';
// import { useAuthStore } from '@/lib/store/authStore';
// import styles from './CreateOrderForm.module.css';




// interface UserData {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   city: string;
//   postOfficeNum: string;
// }

// const OrderSchema = Yup.object().shape({
//   firstName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
//   lastName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
//   phone: Yup.string()
//     .test('phone-format', 'Невірний формат', (value) => {
//       if (!value) return false;
//       const digitsOnly = value.replace(/[^\d+]/g, '');
//       return /^\+38\d{10}$/.test(digitsOnly);
//     })
//     .required("Обов'язкове поле"),
//   city: Yup.string().min(2, 'Мінімум 2 символи').required("Обов'язкове поле"),
//   novaPoshtaBranch: Yup.string().required("Обов'язкове поле"),
// });

// const formatPhoneNumber = (value: string) => {
//   const numbers = value.replace(/\D/g, '');
//   if (numbers.startsWith('38')) return '+' + numbers;
//   if (numbers.length === 0) return '';
//   if (numbers.length <= 3) return `+38 (${numbers}`;
//   if (numbers.length <= 6) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
//   if (numbers.length <= 8) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(6)}`;
//   return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(6, 8)}.${numbers.slice(8, 10)}`;
// };

// export default function CreateOrderForm() {
//   const router = useRouter();
//   const [error, setError] = useState('');
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const { cartItems, clearCart } = useShopStore();
//   const { isAuthenticated, token } = useAuthStore();

//   useEffect(() => {
//     const loadUserData = async () => {
//       if (!isAuthenticated || !token) return;
      
//       try {
//         const response = await fetch('https://clothica-back.onrender.com/api/users/me', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUserData(data);
//         }
//       } catch (error) {
//         console.error('Помилка завантаження даних:', error);
//       }
//     };

//     loadUserData();
//   }, [isAuthenticated, token]);

//   if (cartItems.length === 0) {
//     return (
//       <div className={styles.emptyCart}>
//         <p>Кошик порожній</p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {error && <div className={styles.errorText}>{error}</div>}
      
//       <Formik
//         initialValues={{
//           firstName: userData?.firstName || '',
//           lastName: userData?.lastName || '',
//           phone: userData?.phone || '',
//           city: userData?.city || '',
//           novaPoshtaBranch: userData?.postOfficeNum || '',
//           comment: '',
//         }}
//         validationSchema={OrderSchema}
//         onSubmit={async (values, { setSubmitting }) => {
//           try {
//             setError('');
            
//             if (cartItems.length === 0) {
//               setError('Кошик порожній');
//               setSubmitting(false);
//               return;
//             }
            
//             const orderData = {
//               ...values,
//               items: cartItems.map(item => ({
//                 productId: item.goodId,
//                 quantity: item.amount,
//                 price: item.price,
//               })),
//             };

//             await createOrder(orderData);
//             clearCart();
//             router.push('/goods');
            
//           } catch (error: unknown) {
//             if (error instanceof Error) {
//               setError(error.message);
//             } else {
//               setError('Помилка створення замовлення');
//             }
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ isSubmitting, setFieldValue, values }) => (
//           <Form className={styles.form}>
//             <h3 className={styles.subtitle}>Особиста інформація</h3>
            
//             <div className={styles.nameRow}>
//               <div className={styles.field}>
//                 <label className={styles.label}>Ім&apos;я*</label>
//                 <Field type="text" name="firstName" className={styles.input} placeholder="Ім'я" />
//                 <ErrorMessage name="firstName" component="div" className={styles.errorText} />
//               </div>

//               <div className={styles.field}>
//                 <label className={styles.label}>Прізвище*</label>
//                 <Field type="text" name="lastName" className={styles.input} placeholder="Прізвище" />
//                 <ErrorMessage name="lastName" component="div" className={styles.errorText} />
//               </div>
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>Телефон*</label>
//               <Field
//                 type="tel"
//                 name="phone"
//                 className={styles.input}
//                 placeholder="+38 (0__) __.__.__"
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                   const formatted = formatPhoneNumber(e.target.value);
//                   setFieldValue('phone', formatted);
//                 }}
//                 value={values.phone}
//               />
//               <ErrorMessage name="phone" component="div" className={styles.errorText} />
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>Місто*</label>
//               <Field type="text" name="city" className={styles.input} placeholder="Місто" />
//               <ErrorMessage name="city" component="div" className={styles.errorText} />
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>Відділення НП*</label>
//               <Field type="text" name="novaPoshtaBranch" className={styles.input} placeholder="1" />
//               <ErrorMessage name="novaPoshtaBranch" component="div" className={styles.errorText} />
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>Коментар</label>
//               <Field as="textarea" name="comment" className={styles.textarea} placeholder="Коментар" rows={4} />
//             </div>

//             <button type="submit" disabled={isSubmitting} className={styles.button}>
//               {isSubmitting ? 'Відправка...' : 'Оформити замовлення'}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { createOrder, getCurrentUser } from '@/lib/api';
// import { useShopStore } from '@/lib/store/cartStore';
// import { useAuthStore } from '@/lib/store/authStore';
// import styles from './CreateOrderForm.module.css';

// interface UserData {
//   _id?: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   city: string;
//   postOfficeNum: string;
// }

// const OrderSchema = Yup.object().shape({
//   firstName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
//   lastName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
//   phone: Yup.string()
//     .test('phone-format', 'Невірний формат', (value) => {
//       if (!value) return false;
//       const digitsOnly = value.replace(/[^\d+]/g, '');
//       return /^\+38\d{10}$/.test(digitsOnly);
//     })
//     .required("Обов'язкове поле"),
//   city: Yup.string().min(2, 'Мінімум 2 символи').required("Обов'язкове поле"),
//   novaPoshtaBranch: Yup.string().required("Обов'язкове поле"),
// });

// const formatPhoneNumber = (value: string) => {
//   const numbers = value.replace(/\D/g, '');
//   if (numbers.startsWith('38')) return '+' + numbers;
//   if (numbers.length === 0) return '';
//   if (numbers.length <= 3) return `+38 (${numbers}`;
//   if (numbers.length <= 6) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
//   if (numbers.length <= 8) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(6)}`;
//   return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(6, 8)}.${numbers.slice(8, 10)}`;
// };

// // Функция для обработки ошибок API
// const getErrorMessage = (error: unknown): string => {
//   if (error instanceof Error) {
//     const message = error.message;
    
//     // Обрабатываем различные типы ошибок
//     if (message.includes('status code 400')) {
//       return 'Невірні дані. Перевірте правильність заповнення полів.';
//     } else if (message.includes('status code 401')) {
//       return 'Необхідно авторизуватися для створення замовлення.';
//     } else if (message.includes('status code 403')) {
//       return 'Доступ заборонено.';
//     } else if (message.includes('status code 404')) {
//       return 'Сторінку не знайдено.';
//     } else if (message.includes('status code 409')) {
//       return 'Замовлення з такими даними вже існує.';
//     } else if (message.includes('status code 500')) {
//       return 'Внутрішня помилка сервера. Спробуйте пізніше.';
//     } else if (message.includes('Network Error') || message.includes('Failed to fetch')) {
//       return 'Помилка з\'єднання. Перевірте інтернет-з\'єднання.';
//     } else if (message.includes('timeout')) {
//       return 'Час очікування вийшов. Спробуйте ще раз.';
//     }
    
//     return message;
//   }
  
//   return 'Помилка створення замовлення. Спробуйте ще раз.';
// };

// export default function CreateOrderForm() {
//   const router = useRouter();
//   const [error, setError] = useState('');
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const { cartItems, clearCart } = useShopStore();
//   const { isAuthenticated } = useAuthStore();

//   useEffect(() => {
//     const loadUserData = async () => {
//       if (!isAuthenticated) return;
      
//       try {
//         const data = await getCurrentUser();
//         console.log('📋 [USER] Данные пользователя:', data);
//         setUserData(data);
//       } catch (error) {
//         console.error('Помилка завантаження даних:', error);
//       }
//     };

//     loadUserData();
//   }, [isAuthenticated]);

//   if (cartItems.length === 0) {
//     return (
//       <div className={styles.emptyCart}>
//         <p>Кошик порожній</p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {error && <div className={styles.errorText}>{error}</div>}
      
//       <Formik
//         initialValues={{
//           firstName: userData?.firstName || '',
//           lastName: userData?.lastName || '',
//           phone: userData?.phone || '',
//           city: userData?.city || '',
//           novaPoshtaBranch: userData?.postOfficeNum || '',
//           comment: '',
//         }}
//         validationSchema={OrderSchema}
//         onSubmit={async (values, { setSubmitting }) => {
//           try {
//             setError('');
            
//             if (cartItems.length === 0) {
//               setError('Кошик порожній');
//               setSubmitting(false);
//               return;
//             }
            
//             const orderData = {
//               userId: isAuthenticated && userData?._id ? userData._id : null,
//               items: cartItems.map(item => ({
//                 productId: item.goodId,
//                 quantity: item.amount,
//                 price: item.price,
//               })),
//               totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.amount), 0),
//               deliveryDetails: {
//                 fullName: `${values.firstName} ${values.lastName}`,
//                 phone: values.phone,
//                 address: `${values.city}, ${values.novaPoshtaBranch}`,
//               },
//               comment: values.comment,
//             };

//             console.log('🔵 [FRONT] Отправляем заказ:', orderData);
//             await createOrder(orderData);
            
//             clearCart();
//             router.push('/goods');
            
//           } catch (error: unknown) {
//             const errorMessage = getErrorMessage(error);
//             setError(errorMessage);
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ isSubmitting, setFieldValue, values, errors }) => {
//           // Проверяем, есть ли ошибки валидации
//           const hasValidationErrors = Object.keys(errors).length > 0;
//           const allRequiredFieldsFilled = 
//             values.firstName && 
//             values.lastName && 
//             values.phone && 
//             values.city && 
//             values.novaPoshtaBranch;
          
//           // Кнопка disabled если есть ошибки или не все обязательные поля заполнены
//           const isButtonDisabled = isSubmitting || hasValidationErrors || !allRequiredFieldsFilled;

//           return (
//             <Form className={styles.form}>
//               <h3 className={styles.subtitle}>Особиста інформація</h3>
              
//               <div className={styles.nameRow}>
//                 <div className={styles.field}>
//                   <label className={styles.label}>Ім&apos;я*</label>
//                   <Field 
//                     type="text" 
//                     name="firstName" 
//                     className={styles.input} 
//                     placeholder="Ім'я" 
//                   />
//                   <ErrorMessage name="firstName" component="div" className={styles.errorText} />
//                 </div>

//                 <div className={styles.field}>
//                   <label className={styles.label}>Прізвище*</label>
//                   <Field 
//                     type="text" 
//                     name="lastName" 
//                     className={styles.input} 
//                     placeholder="Прізвище" 
//                   />
//                   <ErrorMessage name="lastName" component="div" className={styles.errorText} />
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
//                     setFieldValue('phone', formatted);
//                   }}
//                   value={values.phone}
//                 />
//                 <ErrorMessage name="phone" component="div" className={styles.errorText} />
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
//                   <ErrorMessage name="city" component="div" className={styles.errorText} />
//                 </div>

//                 <div className={styles.field}>
//                   <label className={styles.label}>Номер відділення Нової Пошти*</label>
//                   <Field 
//                     type="text" 
//                     name="novaPoshtaBranch" 
//                     className={styles.input} 
//                     placeholder="1" 
//                   />
//                   <ErrorMessage name="novaPoshtaBranch" component="div" className={styles.errorText} />
//                 </div>
//               </div>

//               <div className={styles.field}>
//                 <label className={styles.label}>Коментар</label>
//                 <Field as="textarea" name="comment" className={styles.textarea} placeholder="Коментар" rows={4} />
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={isButtonDisabled}
//                 className={styles.button}
//               >
//                 {isSubmitting ? 'Відправка...' : 'Оформити замовлення'}
//               </button>
//             </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// }








'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createOrder, getCurrentUser } from '@/lib/api';
import { useShopStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './CreateOrderForm.module.css';

interface UserData {
  _id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  postOfficeNum: string;
}

const OrderSchema = Yup.object().shape({
  firstName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
  lastName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язкове поле"),
  phone: Yup.string()
    .test('phone-format', 'Невірний формат', (value) => {
      if (!value) return false;
      const digitsOnly = value.replace(/[^\d+]/g, '');
      return /^\+38\d{10}$/.test(digitsOnly);
    })
    .required("Обов'язкове поле"),
  city: Yup.string().min(2, 'Мінімум 2 символи').required("Обов'язкове поле"),
  novaPoshtaBranch: Yup.string().required("Обов'язкове поле"),
});

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.startsWith('38')) return '+' + numbers;
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return `+38 (${numbers}`;
  if (numbers.length <= 6) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  if (numbers.length <= 8) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}.${numbers.slice(6, 8)}.${numbers.slice(8, 10)}`;
};

// Функция для обработки ошибок API
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message;
    
    if (message.includes('status code 400')) {
      return 'Невірні дані. Перевірте правильність заповнення полів.';
    } else if (message.includes('status code 401')) {
      return 'Необхідно авторизуватися для створення замовлення.';
    } else if (message.includes('status code 403')) {
      return 'Доступ заборонено.';
    } else if (message.includes('status code 404')) {
      return 'Сторінку не знайдено.';
    } else if (message.includes('status code 409')) {
      return 'Замовлення з такими даними вже існує.';
    } else if (message.includes('status code 500')) {
      return 'Внутрішня помилка сервера. Спробуйте пізніше.';
    } else if (message.includes('Network Error') || message.includes('Failed to fetch')) {
      return 'Помилка з\'єднання. Перевірте інтернет-з\'єднання.';
    } else if (message.includes('timeout')) {
      return 'Час очікування вийшов. Спробуйте ще раз.';
    }
    
    return message;
  }
  
  return 'Помилка створення замовлення. Спробуйте ще раз.';
};

export default function CreateOrderForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const { cartItems, clearCart } = useShopStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) return;
      
      try {
        const data = await getCurrentUser();
        console.log('📋 [USER] Данные пользователя:', data);
        setUserData(data);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    };

    loadUserData();
  }, [isAuthenticated]);

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <p>Кошик порожній</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.errorText}>{error}</div>}
      
      <Formik
        initialValues={{
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          phone: userData?.phone || '',
          city: userData?.city || '',
          novaPoshtaBranch: userData?.postOfficeNum || '',
          comment: '',
        }}
        validationSchema={OrderSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setError('');
            
            if (cartItems.length === 0) {
              setError('Кошик порожній');
              setSubmitting(false);
              return;
            }
            
            // Создаем данные в формате, который ожидает CreateOrderRequest
            const orderData = {
              userId: isAuthenticated && userData?._id ? userData._id : null,
              items: cartItems.map(item => ({
                productId: item.goodId,
                quantity: item.amount,
                price: item.price,
              })),
              totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.amount), 0),
              deliveryDetails: {
                fullName: `${values.firstName} ${values.lastName}`,
                phone: values.phone.replace(/\D/g, ''), // Убираем форматирование
                address: `${values.city}, ${values.novaPoshtaBranch}`,
              },
              comment: values.comment,
            };

            console.log('🔵 [FRONT] Отправляем заказ:', orderData);
            await createOrder(orderData);
            
            clearCart();
            router.push('/goods');
            
          } catch (error: unknown) {
            const errorMessage = getErrorMessage(error);
            setError(errorMessage);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values, errors }) => {
          // Проверяем, есть ли ошибки валидации
          const hasValidationErrors = Object.keys(errors).length > 0;
          const allRequiredFieldsFilled = 
            values.firstName && 
            values.lastName && 
            values.phone && 
            values.city && 
            values.novaPoshtaBranch;
          
          // Кнопка disabled если есть ошибки или не все обязательные поля заполнены
          const isButtonDisabled = isSubmitting || hasValidationErrors || !allRequiredFieldsFilled;

          return (
            <Form className={styles.form}>
              <h3 className={styles.subtitle}>Особиста інформація</h3>
              
              <div className={styles.nameRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Ім&apos;я*</label>
                  <Field 
                    type="text" 
                    name="firstName" 
                    className={styles.input} 
                    placeholder="Ім'я" 
                  />
                  <ErrorMessage name="firstName" component="div" className={styles.errorText} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Прізвище*</label>
                  <Field 
                    type="text" 
                    name="lastName" 
                    className={styles.input} 
                    placeholder="Прізвище" 
                  />
                  <ErrorMessage name="lastName" component="div" className={styles.errorText} />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Телефон*</label>
                <Field
                  type="tel"
                  name="phone"
                  className={styles.input}
                  placeholder="+38 (0__) __.__.__"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFieldValue('phone', formatted);
                  }}
                  value={values.phone}
                />
                <ErrorMessage name="phone" component="div" className={styles.errorText} />
              </div>

              <div className={styles.nameRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Місто доставки*</label>
                  <Field 
                    type="text" 
                    name="city" 
                    className={styles.input} 
                    placeholder="Ваше місто" 
                  />
                  <ErrorMessage name="city" component="div" className={styles.errorText} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Номер відділення Нової Пошти*</label>
                  <Field 
                    type="text" 
                    name="novaPoshtaBranch" 
                    className={styles.input} 
                    placeholder="1" 
                  />
                  <ErrorMessage name="novaPoshtaBranch" component="div" className={styles.errorText} />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Коментар</label>
                <Field as="textarea" name="comment" className={styles.textarea} placeholder="Коментар" rows={4} />
              </div>

              <button 
                type="submit" 
                disabled={isButtonDisabled}
                className={styles.button}
              >
                {isSubmitting ? 'Відправка...' : 'Оформити замовлення'}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}