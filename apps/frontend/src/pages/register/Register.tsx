import { ChangeEvent, FC, FormEvent, ReactElement, useState } from 'react';
import styles from './Register.module.scss';
import { LoginForm } from '../../auth/auth.types.ts';
const initialFormState = {
    email: '',
    password: '',
};

const Register: FC = (): ReactElement => {
    const [form, setForm] = useState<LoginForm>(initialFormState);

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
        // TODO: Add register logic as soon as the backend is ready
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerContainer}>
                <form className={styles.registerForm} onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleEmailChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handlePasswordChange}
                    />
                    <button className={styles.registerButton} type="submit">
                        Register
                    </button>
                </form>

                <div className={styles.topMobile}>
                    <p className={styles.dodoNameMobile}>DoDo</p>
                    <hr className={styles.hrLineMobile}></hr>
                </div>
                <div className={styles.bottomBlock}></div>
            </div>
        </div>
    );
};

export default Register;
