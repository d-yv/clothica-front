'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import styles from './RegistrationForm.module.css';

interface RegistrationFormValues {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const RegistrationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .required("Обов'язкове поле"),
  phone: Yup.string()
    .test('phone-format', 'Невірний формат телефону', (value) => {
      if (!value) return false;
      // Удаляем все нецифровые символы кроме +
      const digitsOnly = value.replace(/[^\d+]/g, '');
      // Проверяем что номер начинается с +38 и имеет 10 цифр после
      return /^\+38\d{10}$/.test(digitsOnly);
    })
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(6, 'Пароль повинен містити мінімум 6 символів')
    .required("Обов'язкове поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Паролі повинні співпадати')
    .required("Обов'язкове поле"),
});

export default function RegistrationForm() {
  const router = useRouter();

  const initialValues: RegistrationFormValues = {
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9+\-()\s]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Escape|Home|End|PageUp|PageDown/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (
    values: RegistrationFormValues,
    { setSubmitting }: FormikHelpers<RegistrationFormValues>
  ) => {
    try {
      console.log('Registration data:', values);
      // TODO: API call for registration
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Помилка реєстрації. Спробуйте ще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Ім&apos;я*
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className={`${styles.input} ${
                  touched.name && errors.name ? styles.inputError : ''
                }`}
                placeholder="Ваше ім'я"
              />
              <ErrorMessage name="name" component="div" className={styles.errorText} />
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
}