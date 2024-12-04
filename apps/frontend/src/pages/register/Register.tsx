import { ChangeEvent, FC, FormEvent, ReactElement, useState } from 'react';
import styles from './Register.module.scss';
const initialFormState = {
    username: '',
    email: '',
    password: '',
};
// This interface is temporary
interface RegisterForm {
    username: string;
    email: string;
    password: string;
}

const Register: FC = (): ReactElement => {
    const [form, setForm] = useState<RegisterForm>(initialFormState);

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const userName = event.target.value;
        setForm((prevState) => ({ ...prevState, userName }));
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
        // TODO: Add register logic as soon as the backend is ready
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerContainer}>
                <h1 className={styles.dodoName}>DoDo Register</h1>
                <img
                    src="/favicon.ico"
                    alt="DoDo Logo"
                    className={styles.dodoLogo}
                />
                <form className={styles.registerForm} onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleUsernameChange}
                    />
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
                    <p className={styles.dodoNameMobile}>DoDo Register</p>
                    <hr className={styles.hrLineMobile}></hr>
                </div>
                <div className={styles.bottomBlock}></div>
            </div>
        </div>
    );
};

export default Register;
