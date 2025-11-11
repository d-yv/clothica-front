'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './UserInfoForm.module.css';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  warehouseNumber: string;
  comment: string;
}
const ValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Ім'я обов'язкове").min(2, "Занадто коротке ім'я"),
  lastName: Yup.string().required("Прізвище обов'язкове").min(2, "Занадто коротке прізвище"),
  phone: Yup.string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Невірний формат телефону')
    .required('Номер телефону обов\'язковий'),
  city: Yup.string().required('Місто доставки обов\'язкове'),
  warehouseNumber: Yup.string().required('Номер відділення обов\'язковий'),
  comment: Yup.string().optional(),
});

export default function UserInfoForm(){
  const initialValues: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  warehouseNumber: '',
  comment: '',
  };
  
  const handleSubmit = async (values: FormData, { setSubmitting, setStatus, resetForm }: any) => {
    setStatus({ success: false, message: 'Відправлення даних...' });
    const API_URL = 'http://localhost:4000/api/orders';

    try {
      const response = await fetch(API_URL, {
        method: 'PATH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Помилка HTTP: ${response.status}`);
      }
      const result = await response.json(); 

      setStatus({ success: true, message: result.message || 'Зміни внесено' });
      resetForm();
    } catch (error) {
      console.error('Помилка при відправці форми:', error);
      setStatus({ 
          success: false, 
          message: `Помилка відправки: ${error instanceof Error ? error.message : 'Невідома помилка'}` 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<FormData>
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form className={styles.formContainer}>
          
          <h3 className={styles.formTitle}>Особиста інформація</h3> 
          
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

          <div className={styles.formWrapper}>
            <label htmlFor="warehouseNumber">Номер відділення*</label>
            <Field name="warehouseNumber" type="text" className={styles.formInput} />
            <ErrorMessage name="warehouseNumber" component="div" className={styles.errorMessage} />
          </div>
          
          <div className={styles.formWrapper}>
            <label htmlFor="comment">Коментар</label>
            <Field name="comment" as="textarea" rows={4} className={styles.formInputTextarea} />
            <ErrorMessage name="comment" component="div" className={styles.errorMessage} />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={styles.submitButton}>
            {isSubmitting ? 'Обробка...' : 'Оформити замовлення'}
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
