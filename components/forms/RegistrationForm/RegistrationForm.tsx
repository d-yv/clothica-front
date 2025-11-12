//componets/forms/RegistrationForm/RegistrationForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, RegisterRequest } from '@/lib/api';
import styles from './RegistrationForm.module.css';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';


type RegistrationFormValues = RegisterRequest;

const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(50, "Ім'я не повинно перевищувати 50 символів")
    .matches(/^[a-zA-Zа-яА-ЯґҐєЄіІїЇ'’\s-]+$/, "Ім'я може містити лише літери, апостроф, дефіс та пробіли")
    .required("Обов'язкове поле"),
  phone: Yup.string()
    .test('phone-format', 'Невірний формат телефону', (value) => {
      if (!value) return false;
      const digitsOnly = value.replace(/[^\d+]/g, '');
      return /^\+38\d{10}$/.test(digitsOnly);
    })
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, 'Пароль повинен містити мінімум 8 символів')
    .required("Обов'язкове поле"),
});

// Функция для форматирования номера телефона
const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.startsWith('38')) {
    return '+' + numbers;
  }
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return `+38 (${numbers}`;
  if (numbers.length <= 6) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  if (numbers.length <= 8) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 8)}-${numbers.slice(8, 10)}`;
};

const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/[0-9+\-()\s]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Escape|Home|End|PageUp|PageDown/.test(e.key)) {
    e.preventDefault();
  }
};

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const initialValues: RegistrationFormValues = {
    firstName: '',
    phone: '',
    password: '',
  };

  const handleSubmit = async (
    values: RegistrationFormValues,
    { setSubmitting }: FormikHelpers<RegistrationFormValues>
  ) => {
    try {
      setError('');
      console.log('Sending registration data:', values);
      
      const res = await register(values);
      console.log('Registration successful:', res);
      
      router.push('/');
      
    } catch (error: unknown) {
      console.error('Registration error:', error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Помилка реєстрації. Спробуйте ще раз.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorText}>
          {error}
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="firstName" className={styles.label}>
                Ім&apos;я*
              </label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className={`${styles.input} ${
                  touched.firstName && errors.firstName ? styles.inputError : ''
                }`}
                placeholder="Ваше ім'я"
              />
              <ErrorMessage name="firstName" component="div" className={styles.errorText} />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                Номер телефону*
              </label>
              <Field
                type="tel"
                id="phone"
                name="phone"
                className={`${styles.input} ${
                  touched.phone && errors.phone ? styles.inputError : ''
                }`}
                placeholder="+38 (0__) __-__-__"
                onKeyPress={handleKeyPress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setFieldValue('phone', formatted);
                }}
                value={values.phone}
              />
              <ErrorMessage name="phone" component="div" className={styles.errorText} />
              <div className={styles.phoneHint}>
                Формат: +38 (0XX) XXX-XX-XX
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Пароль*
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className={`${styles.input} ${
                  touched.password && errors.password ? styles.inputError : ''
                }`}
                placeholder="Введіть ваш пароль"
              />
              <ErrorMessage name="password" component="div" className={styles.errorText} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.button}
            >
              {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;