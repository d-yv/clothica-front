'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import styles from './UserInfoForm.module.css';

interface UserUpdateData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  postOfficeNum: string;
}

interface UserInfoFormProps {
    currentUser: UserUpdateData | undefined;
    onProfileUpdate: () => void;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("Ім'я обов'язкове").min(2, "Занадто коротке ім'я"),
  lastName: Yup.string().notRequired(),
  phone: Yup.string()
    .matches(/^\+380\d{9}$/, 'Телефон має бути у форматі +380XXXXXXXXX')
    .notRequired(),
  city: Yup.string().notRequired(),
  postOfficeNum: Yup.string().notRequired(),
});


const UserInfoForm: React.FC<UserInfoFormProps> = ({ currentUser, onProfileUpdate }) => {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  const initialValues: UserUpdateData = currentUser || {
      firstName: '',
      lastName: '',
      phone: '', 
      city: '',
      postOfficeNum: '',
  };

  const handleSubmit = async (values: UserUpdateData, { setSubmitting, setStatus }: FormikHelpers<UserUpdateData>) => {
    setStatus({ success: false, message: 'Збереження змін...' });
    
    const API_URL = '/api/user'; 
    
    const dataToSend = {
      firstName: values.firstName,
      lastName: values.lastName || undefined,
      phone: values.phone || undefined,
      city: values.city || undefined,
      postOfficeNum: values.postOfficeNum || undefined,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
        credentials: 'include', 
      });
      
      if (response.status === 401) {
          setStatus({ success: false, message: 'Помилка авторизації. Сесія недійсна.' });
          return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Помилка: ${response.status}`);
      }

      
      setStatus({ success: true, message: 'Дані успішно оновлено!' });
      
      onProfileUpdate(); 

    } catch (error) {
      console.error('Update failed:', error);
      setStatus({ success: false, message: `Помилка при оновленні: ${(error as Error).message}` });
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className={styles.formContainer}>
      
      {initialValues.firstName !== '' ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form className={styles.form}>
                <div className={styles.formWrap}>
                  <div className={styles.formWrapper}> 
                  <label htmlFor="firstName">Ім'я*</label>
                  <Field type="text" id="firstName" name="firstName" className={styles.formInput} /> 
                  <ErrorMessage name="firstName" component="div" className={styles.errorMessage} />
                </div>
                
                <div className={styles.formWrapper}>
                  <label htmlFor="lastName">Прізвище*</label>
                  <Field type="text" id="lastName" name="lastName" className={styles.formInput} />
                  <ErrorMessage name="lastName" component="div" className={styles.errorMessage} />
                </div>
                </div>
                
                <div className={styles.formWrapper}>
                  <label htmlFor="phone">Телефон*</label>
                  <Field type="text" id="phone" name="phone" className={styles.formInput} />
                  <ErrorMessage name="phone" component="div" className={styles.errorMessage} />
                </div>
                
                <div className={styles.formWrap}>
                <div className={styles.formWrapper}>
                  <label htmlFor="city">Місто доставки*</label>
                  <Field type="text" id="city" name="city" className={styles.formInput} />
                  <ErrorMessage name="city" component="div" className={styles.errorMessage} />
                </div>
                <div className={styles.formWrapper}>
                  <label htmlFor="postOfficeNum">Відділення Нової Пошти*</label>
                  <Field type="text" id="postOfficeNum" name="postOfficeNum" className={styles.formInput} />
                  <ErrorMessage name="postOfficeNum" component="div" className={styles.errorMessage} />
                </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={styles.submitButton}
                >
                  {isSubmitting ? 'Зберігаю...' : 'Зберегти зміни'}
                </button>
                {status && (
                  <div className={status.success ? styles.successMessage : styles.errorMessage}>
                    {status.message}
                  </div>
                )}
              </Form>
            )}
          </Formik>
      ) : (
          <p className={styles.errorMessage}>
              Не вдалося ініціалізувати форму. Перевірте статус авторизації.
          </p>
      )}
    </div>
  );
};
export default UserInfoForm;
