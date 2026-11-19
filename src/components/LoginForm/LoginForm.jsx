import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../redux/auth/operations';
import s from './LoginForm.module.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .max(64, 'Email can contain maximum 64 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password can contain maximum 64 characters')
    .required('Password is required'),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const hasEmptyFields = !values.email.trim() || !values.password.trim();
    if (hasEmptyFields) {
      toast.error('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const result = await dispatch(login(values));

      if (login.fulfilled.match(result)) {
        navigate('/');
      }
    } catch {
      // Redux slice handles toast notifications
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={s.form}>
            <div className={s.fieldWrapper}>
              <label className={s.label}>Enter your email address</label>
              <Field
                type="email"
                name="email"
                placeholder="email@gmail.com"
                className={s.field}
              />
              <div className={s.errorContainer}>
                <ErrorMessage
                  name="email"
                  component="div"
                  className={s.error}
                />
              </div>
            </div>

            <div className={s.fieldWrapper}>
              <label className={s.label}>Enter a password</label>
              <div className={s.passwordContainer}>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="*********"
                  className={s.field}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={s.passwordToggle}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <>
                      <svg className={`${s.icon} ${s.iconMobile}`}>
                        <use href="/icons-login.svg#eye-open-mob" />
                      </svg>
                      <svg className={`${s.icon} ${s.iconTablet}`}>
                        <use href="/icons-login.svg#eye-open-tab" />
                      </svg>
                      <svg className={`${s.icon} ${s.iconDesktop}`}>
                        <use href="/icons-login.svg#eye-open-desk" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg className={`${s.icon} ${s.iconMobile}`}>
                        <use href="/icons-login.svg#eye-closed-mob" />
                      </svg>
                      <svg className={`${s.icon} ${s.iconTablet}`}>
                        <use href="/icons-login.svg#eye-closed-tab" />
                      </svg>
                      <svg className={`${s.icon} ${s.iconDesktop}`}>
                        <use href="/icons-login.svg#eye-closed-desk" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              <div className={s.errorContainer}>
                <ErrorMessage
                  name="password"
                  component="div"
                  className={s.error}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${s.submitButton} ${isSubmitting ? s.loading : ''}`}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <div className={s.linkWrapper}>
              <span>Don&rsquo;t have an account?</span>
              <Link to="/register" className={s.link}>
                Register
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
