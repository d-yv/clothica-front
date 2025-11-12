//componets/forms/LoginForm/LoginForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '@/lib/api';
import styles from './LoginForm.module.css';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

// Тип для формы
type LoginFormValues = LoginRequest;

const LoginSchema = Yup.object().shape({

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

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const initialValues: LoginFormValues = {
    phone: '',
    password: '',
  };

  const handleSubmit = async (
  values: LoginFormValues,
  { setSubmitting }: FormikHelpers<LoginFormValues>
) => {
  try {
    setError('');
    console.log('Sending login data:', values); 
    
    const res = await login(values);
    console.log('Login successful:', res); 
    
    
    router.push('/');
    
  } catch (error: unknown) {
    console.error('Login error:', error); 
    
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('Помилка входу. Спробуйте ще раз.'); 
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
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, setFieldValue, values}) => (
          <Form className={styles.form}>
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
              {isSubmitting ? 'Вхід...' : 'Увійти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignIn;