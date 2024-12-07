import { ChangeEvent, FC, FormEvent, ReactElement, useState } from 'react';
import styles from './Register.module.scss';
import {
    RegisterForm,
    RegisterValidationErrors,
} from '../../auth/auth.types.ts';
import useAuthApi from '../../api/useAuthApi.tsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { Route } from '../../router/router.types.ts';
import { registerFormValidator } from '../../auth/auth.utils.ts';

const initialFormState = {
    username: '',
    email: '',
    password: '',
};

const Register: FC = (): ReactElement => {
    const [form, setForm] = useState<RegisterForm>(initialFormState);
    const [formErrors, setFormErrors] = useState<RegisterValidationErrors>({});
    const { useRegister } = useAuthApi();
    const registerQuery = useRegister();
    const navigate = useNavigate();

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const username = event.target.value;
        setForm((prevState) => ({ ...prevState, username }));
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        setForm((prevState) => ({ ...prevState, email }));
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        setForm((prevState) => ({ ...prevState, password }));
    };

    const handleRegister = async (event: FormEvent) => {
        event.preventDefault();
        setFormErrors(registerFormValidator(form));
        registerQuery
            .mutateAsync(form)
            .then(() => {
                toast('Registered successfully, redirecting you to home page', {
                    type: 'success',
                });
                setTimeout(() => {
                    navigate(Route.HOME);
                }, 2000);
            })
            .catch(() => {
                toast('Register failed', { type: 'error' });
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerContainer}>
                <div className={styles.leftSide}>
                    <form
                        className={styles.registerForm}
                        onSubmit={handleRegister}
                    >
                        <input
                            type="text"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleUsernameChange}
                        />
                        <p className={styles.formErrors}>
                            {formErrors.username}
                        </p>
                        <input
                            type="text"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleEmailChange}
                        />
                        <p className={styles.formErrors}>{formErrors.email}</p>
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handlePasswordChange}
                        />
                        <p className={styles.formErrors}>
                            {formErrors.password}
                        </p>
                        <button className={styles.registerButton} type="submit">
                            Register
                        </button>
                        <p className={styles.login}>
                            Already have an account?
                            <p>
                                Click{' '}
                                <span
                                    className={styles.loginLink}
                                    onClick={() => navigate(Route.LOGIN)}
                                >
                                    here
                                </span>{' '}
                                to login.
                            </p>
                        </p>
                    </form>
                </div>

                <div className={styles.middleBar}></div>

                <div className={styles.rightSide}>
                    <div className={styles.dodo}>
                        <h1 className={styles.dodoName}>DoDo Register</h1>
                        <img
                            src="/favicon.ico"
                            alt="DoDo Logo"
                            className={styles.dodoLogo}
                        />
                    </div>
                    <p>Just one more step</p>
                    <p>before you can use the app.</p>
                    <p className={styles.bottomSentence}>
                        Complete your registration <br></br>to gain access to
                        all the features.
                    </p>
                </div>

                <div className={styles.topMobile}>
                    <p className={styles.dodoNameMobile}>DoDo Register</p>
                    <hr className={styles.hrLineMobile}></hr>
                </div>
                <div className={styles.bottomBlock}></div>
            </div>
        </div>
    );
};

export default Register;
