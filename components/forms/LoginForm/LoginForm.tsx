'use client';

import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '@/lib/api';
import styles from './LoginForm.module.css';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

type LoginFormValues = LoginRequest;

const LoginSchema = Yup.object().shape({
  phone: Yup.string()
    .test('phone-format', 'Невірний формат телефону', (value) => {
      if (!value) return false;
      const digitsOnly = value.replace(/[^\d+]/g, '');
      return /^\+38\d{10}$/.test(digitsOnly);
    })
    .required("Обов'язкове поле"),
  password: Yup.string().required("Обов'язкове поле"),
});

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.startsWith('38')) {
    return '+' + numbers;
  }

  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return `+38 (${numbers}`;
  if (numbers.length <= 6) return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  if (numbers.length <= 8)
    return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  return `+38 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 8)}-${numbers.slice(
    8,
    10
  )}`;
};

const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/[0-9+\-()\s]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Escape|Home|End|PageUp|PageDown/.test(
      e.key
    )
  ) {
    e.preventDefault();
  }
};

const SignIn = () => {
  const router = useRouter();

  const initialValues: LoginFormValues = {
    phone: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const user = await login(values);

      localStorage.setItem('token', 'authenticated');
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Ви успішно увійшли'); // ✅ toast успіху

      router.push('/'); // цього достатньо, window.location.href не треба
    } catch (error: unknown) {
      console.error('Login error:', error);

      let msg = 'Помилка входу. Спробуйте ще раз.';

      if (error instanceof Error) {
        const errorMessage = error.message;

        if (errorMessage.includes('401') || errorMessage.includes('Invalid credentials')) {
          msg = 'Такий користувач не існує';
        } else if (errorMessage.includes('400') || errorMessage.includes('Validation error')) {
          msg = 'Невірний формат даних';
        } else if (errorMessage.includes('Network Error')) {
          msg = "Проблема з з'єднанням";
        } else {
          msg = errorMessage;
        }
      }

      toast.error(msg); // ✅ показуємо помилку toast'ом
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
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

            <button type="submit" disabled={isSubmitting} className={styles.button}>
              {isSubmitting ? 'Вхід...' : 'Увійти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;