'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './UserInfoForm.module.css';

// --- ЗМІНЕНО: Інтерфейс для оновлення користувача (узгоджено з бекендом) ---
interface UserUpdateData {
  firstName: string;
  lastName: string;
  phone: string; // Залишаємо на фронтенді, хоча бекенд його ігнорує (можливо, додасте пізніше)
  city: string;
  postOfficeNum: string; // ДОДАНО
}

// Припускаємо, що ви хочете бачити поле "Номер відділення" як "postOfficeNum"
const UserUpdateValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Ім'я обов'язкове").min(2, "Занадто коротке ім'я"),
  lastName: Yup.string().required("Прізвище обов'язкове").min(2, "Занадто коротке прізвище"),
  phone: Yup.string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Невірний формат телефону')
    .required('Номер телефону обов\'язковий'),
  city: Yup.string().required('Місто доставки обов\'язкове'),
  postOfficeNum: Yup.string().required('Номер відділення обов\'язковий'), // НОВЕ ПОЛЕ
});

interface UserInfoFormProps {
    // Якщо ви передаєте поточні дані користувача для попереднього заповнення
    currentUser?: UserUpdateData; 
}

export default function UserInfoForm({ currentUser }: UserInfoFormProps){
  
  const initialValues: UserUpdateData = currentUser || {
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    postOfficeNum: '', // ДОДАНО
  };
  
  // --- ЗМІНЕНО: Логіка handleSubmit для PATCH /api/users/me ---
  const handleSubmit = async (values: UserUpdateData, { setSubmitting, setStatus }: any) => {
    setStatus({ success: false, message: 'Збереження змін...' });
    
    // --- ЗМІНЕНО: API маршрут для оновлення користувача ---
    const API_URL = 'http://localhost:4000/api/users/me'; 
    
    // --- ВАЖЛИВО: Фільтруємо дані, які надсилаємо. 
    // Навіть якщо бекенд ігнорує 'phone', ми його надсилаємо, але не надсилаємо зайве. ---
    const dataToSend = {
      firstName: values.firstName,
      lastName: values.lastName,
      city: values.city,
      phone: values.phone, // Буде проігноровано бекендом, але ми його надсилаємо
      postOfficeNum: values.postOfficeNum // ДОЗВОЛЕНО бекендом
    };

    try {
      const response = await fetch(API_URL, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          // Cookie (accessToken) надсилаються автоматично!
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.status === 401) {
          throw new Error('Несанкціоновано. Будь ласка, увійдіть знову.');
      }
      
      if (!response.ok) {
        // Якщо це 400, можливо, бекенд не прийняв одне з полів
        const errorBody = await response.json();
        throw new Error(`Помилка HTTP: ${response.status}. ${errorBody.message || 'Помилка валідації.'}`);
      }
      
      const result = await response.json(); 
      
      setStatus({ success: true, message: result.message || 'Дані успішно оновлено!' }); 
      
      // Опціонально: тут можна оновити стан користувача (currentUser) на сторінці Cabinet
      
    } catch (error) {
      console.error('Помилка при оновленні профілю:', error);
      setStatus({ 
          success: false, 
          message: `Помилка відправки: ${error instanceof Error ? error.message : 'Невідома помилка'}` 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<UserUpdateData>
      initialValues={initialValues}
      validationSchema={UserUpdateValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true} 
    >
      {({ isSubmitting, status }) => (
        <Form className={styles.formContainer}>
          
          <h3 className={styles.formTitle}>Особиста інформація</h3> 
          
          {/* Поля залишилися без змін */}
          <div className={styles.formWrapper}>
            <label htmlFor="firstName">Ім'я*</label>
            <Field name="firstName" type="text" className={styles.formInput} />
            <ErrorMessage name="firstName" component="div" className={styles.errorMessage} />
          </div>

          <div className={styles.formWrapper}>
            <label htmlFor="lastName">Прізвище*</label>
            <Field name="lastName" type="text" className={styles.formInput} />
            <ErrorMessage name="lastName" component="div" className={styles.errorMessage} />
          </div>
          
          <div className={styles.formWrapper}>
            <label htmlFor="phone">Номер телефону*</label>
            <Field name="phone" type="tel" className={styles.formInput} />
            <ErrorMessage name="phone" component="div" className={styles.errorMessage} />
          </div>
          
          <div className={styles.formWrapper}>
            <label htmlFor="city">Місто доставки*</label>
            <Field name="city" type="text" className={styles.formInput} />
            <ErrorMessage name="city" component="div" className={styles.errorMessage} />
          </div>

          {/* НОВЕ ПОЛЕ: postOfficeNum */}
          <div className={styles.formWrapper}>
            <label htmlFor="postOfficeNum">Номер відділення*</label>
            <Field name="postOfficeNum" type="text" className={styles.formInput} />
            <ErrorMessage name="postOfficeNum" component="div" className={styles.errorMessage} />
          </div>
          
          {/* Коментар ВИДАЛЕНО, оскільки він не потрібен для оновлення профілю */}
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={styles.submitButton}>
            {isSubmitting ? 'Обробка...' : 'Зберегти зміни'}
          </button>

          {status && status.message && (
            <p className={styles.statusMessage} style={{ color: status.success ? 'green' : 'red' }}>
              {status.message}
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};
