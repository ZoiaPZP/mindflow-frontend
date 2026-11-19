import React, { useState, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import serviceApi from '../../services/api';
import PasswordStrengthBar from './PasswordStrengthBar';
import styles from './RegisterForm.module.css';
import { refreshUser } from '../../redux/auth/operations';
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Minimum 2 characters')
    .max(32, 'Up to 32 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .max(64, 'Up to 64 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'At least 8 characters')
    .max(64, 'Password up to 64 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
      'Use letters, numbers, and symbols'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password'),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const refs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const handleFormSubmit =
    (validateForm, handleSubmit, values, setTouched) => async (e) => {
      e.preventDefault();
      const errors = await validateForm();
      if (Object.keys(errors).length > 0) {
        setTouched({
          name: true,
          email: true,
          password: true,
          confirmPassword: true,
        });
        toast.error(
          'To register, you need to fill in all the fields of the registration form correctly',
          {
            style: {
              animation: 'slide-in 0.4s ease',
            },
          }
        );
        return;
      }
      handleSubmit(e);
    };

  const handleSubmit = async (values, actions) => {
    try {
      const response = await serviceApi.auth.signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      const token = response.data.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
        await dispatch(refreshUser());
      }

      toast.success(`Welcome, ${response.data.user.name}!`, {
        style: {
          animation: 'slide-in 0.4s ease',
        },
      });

      actions.resetForm();
      navigate('/photo');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed', {
        style: {
          animation: 'slide-in 0.4s ease',
        },
      });
    } finally {
      actions.setSubmitting(false);

      const errorKeys = Object.keys(actions.errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        refs[firstErrorKey]?.current?.focus();
      }
    }
  };

  return (
    <div className="formPerspective">
      <div className={`container ${styles.formWrapper}`}>
        <h2>Register</h2>
        <p className={styles.description}>
          <span className={styles.line}>Join our community of mindfulness</span>
          <span className={styles.line}>and wellbeing!</span>
        </p>

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({
            isSubmitting,
            values,
            submitCount,
            validateForm,
            handleSubmit,
            setTouched,
          }) => (
            <Form
              className={styles.form}
              autoComplete="off"
              onSubmit={handleFormSubmit(
                validateForm,
                handleSubmit,
                values,
                setTouched
              )}
            >
              <div className={styles.fieldWrapper}>
                <label htmlFor="name-field">Enter your name</label>
                <Field name="name">
                  {({ field, meta }) => (
                    <>
                      <input
                        {...field}
                        id="name-field"
                        ref={refs.name}
                        type="text"
                        placeholder="Max"
                        autoComplete="given-name"
                        className={`${styles.inputWithIcon} ${
                          (meta.touched || submitCount > 0) && meta.error
                            ? styles.invalid
                            : ''
                        }`}
                      />
                      <div className={styles.errorContainer}>
                        {(meta.touched || submitCount > 0) && meta.error && (
                          <span className={styles.error}>{meta.error}</span>
                        )}
                      </div>
                    </>
                  )}
                </Field>
              </div>
              <div className={styles.fieldWrapper}>
                <label htmlFor="email-field">Enter your email address</label>
                <Field name="email">
                  {({ field, meta }) => (
                    <>
                      <input
                        {...field}
                        id="email-field"
                        ref={refs.email}
                        type="text"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={`${styles.inputWithIcon} ${
                          (meta.touched || submitCount > 0) && meta.error
                            ? styles.invalid
                            : ''
                        }`}
                      />
                      <div className={styles.errorContainer}>
                        {(meta.touched || submitCount > 0) && meta.error && (
                          <span className={styles.error}>{meta.error}</span>
                        )}
                      </div>
                    </>
                  )}
                </Field>
              </div>
              <div className={`${styles.fieldWrapper} ${styles.passwordField}`}>
                <label htmlFor="password-field">Create a strong password</label>
                <div className={styles.passwordWrapper}>
                  <Field name="password">
                    {({ field, meta }) => (
                      <>
                        <input
                          {...field}
                          id="password-field"
                          ref={refs.password}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          autoComplete="off"
                          className={`${styles.inputWithIcon} ${
                            (meta.touched || submitCount > 0) && meta.error
                              ? styles.invalid
                              : ''
                          }`}
                        />
                        <button
                          type="button"
                          className={styles.iconWrapper}
                          onClick={togglePassword}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          <svg className={styles.icon} aria-hidden="true">
                            <use
                              xlinkHref={
                                showPassword
                                  ? '/eyes-sprite.svg#icon-eye-stroke-32'
                                  : '/eyes-sprite.svg#icon-eye-crossed-stroke-32'
                              }
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </Field>
                </div>
                <Field name="password">
                  {({ meta }) => (
                    <div className={styles.errorContainer}>
                      {(meta.touched || submitCount > 0) && meta.error && (
                        <span className={styles.error}>{meta.error}</span>
                      )}
                    </div>
                  )}
                </Field>
                <PasswordStrengthBar
                  password={values.password}
                  confirmPassword={values.confirmPassword}
                />
              </div>
              <div
                className={`${styles.fieldWrapper} ${styles.repeatPassword}`}
              >
                <label htmlFor="confirmPassword-field">
                  Repeat your password
                </label>
                <div className={styles.passwordWrapper}>
                  <Field name="confirmPassword">
                    {({ field, meta }) => (
                      <>
                        <input
                          {...field}
                          id="confirmPassword-field"
                          ref={refs.confirmPassword}
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="********"
                          autoComplete="off"
                          className={`${styles.inputWithIcon} ${
                            (meta.touched || submitCount > 0) && meta.error
                              ? styles.invalid
                              : ''
                          }`}
                        />
                        <button
                          type="button"
                          className={styles.iconWrapper}
                          onClick={toggleConfirm}
                          aria-label={
                            showConfirm ? 'Hide password' : 'Show password'
                          }
                        >
                          <svg className={styles.icon} aria-hidden="true">
                            <use
                              xlinkHref={
                                showConfirm
                                  ? '/eyes-sprite.svg#icon-eye-stroke-32'
                                  : '/eyes-sprite.svg#icon-eye-crossed-stroke-32'
                              }
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </Field>
                </div>
                <Field name="confirmPassword">
                  {({ meta }) => (
                    <div className={styles.errorContainer}>
                      {(meta.touched || submitCount > 0) && meta.error && (
                        <span className={styles.error}>{meta.error}</span>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.btn} ${
                  isSubmitting ? styles.loading : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create account'}
              </button>
            </Form>
          )}
        </Formik>

        <p className={styles.login}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
