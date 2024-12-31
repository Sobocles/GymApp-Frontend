// src/Auth/pages/Register/RegistrationPage.tsx

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import { registerUser } from '../../services/authService';


export const RegistrationPage = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
                .required('Requerido'),
            email: Yup.string()
                .email('Correo electrónico no válido')
                .required('Requerido'),
            password: Yup.string()
                .min(6, 'La contraseña debe tener al menos 6 caracteres')
                .required('Requerido'),
        
        }),
        onSubmit: async (values) => {
            try {
                await registerUser({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                });
                navigate('/auth/login');
            } catch (error) {
                console.error('Error al registrar:', error);
                // Manejar errores, por ejemplo, mostrar un mensaje al usuario
            }
        }
    })

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Registro</h3>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                                placeholder="Nombre de usuario"
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.username && formik.errors.username && (
                                <div className="invalid-feedback">{formik.errors.username}</div>
                            )}
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="email"
                                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                placeholder="Correo electrónico"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            )}
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                placeholder="Contraseña"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            )}
                        </div>

                        <div className="form-group mb-2">
                        
                        </div>

                        <div className="d-grid gap-2">
                            <input
                                type="submit"
                                className="btnSubmit"
                                value="Registrar"
                            />
                        </div>
                        <div className="form-group mt-2 text-center">
                            <span>¿Ya tienes una cuenta? </span>
                            <Link to="/auth/login">Inicia sesión aquí</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
