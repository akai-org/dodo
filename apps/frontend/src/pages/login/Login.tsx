import {ChangeEvent, FC, FormEvent, ReactElement, useState} from "react";
import styles from './Login.module.scss'
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {LoginForm, LoginValidationErrors} from "../../auth/auth.types.ts";
import {loginFormValidator} from "../../auth/auth.utils.ts";
import useAuthApi from "../../api/useAuthApi.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const initialFormState = {
    email: '',
    password: '',
};


const Login: FC = (): ReactElement => {

    const navigate = useNavigate();

    const [form, setForm] = useState<LoginForm>(initialFormState);
    const [, setFormErrors] = useState<LoginValidationErrors>({});
    const [, setIsSubmit] = useState(false);

    const {useLogin, useAuthenticateByGoogle} = useAuthApi()

    const loginQuery = useLogin()
    const googleQuery = useAuthenticateByGoogle();

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        setForm((prevState) => ({ ...prevState, email }));
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        setForm((prevState) => ({ ...prevState, password }));
    };



    const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
        googleQuery.mutateAsync({token: credential})
            .then(() => {
                toast("Login success", { type: 'success' });
                setTimeout(() => { navigate('/home'); }, 2000);
            })
            .catch(() => {
                toast("Login failed", { type: 'error' });
            });
    };

    const handleGoogleLoginFailed = () => {
        toast("Google login failed", { type: 'error' });
    }


    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        setFormErrors(loginFormValidator(form));
        setIsSubmit(true);


        loginQuery.mutateAsync(form)
            .then(() => {
                toast("Login success", { type: 'success' });
                setTimeout(() => { navigate('/home'); }, 2000);
            })
            .catch(() => {
                toast("Login failed", { type: 'error' });
            });
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.topWelcome}>
                        <h1 className={styles.welcomeHeader}>Welcome!</h1>
                        <img src="/favicon.ico" alt="DoDo Logo" className={styles.dodoLogo}/>
                    </div>
                    <p className={styles.leftSideFirstSentence}>
                        This is <span className={styles.dodoName}>DoDo</span>
                    </p>
                    <p className={styles.leftSideDescription}>Your new bird friend in&nbsp;organizing things and time.</p>
                    <p className={styles.leftSideLastSentence}>
                        We hope you will enjoy the app.
                    </p>
                </div>

                <div className={styles.middleBar}></div>

                <div className={styles.rightSide}>
                    {/* <button className={styles.googleButton} onClick={handleGoogleLogin}>
                        <img src="/images/Google__G__Logo.png" alt="" className={styles.googleLogo}/>
                        Continue with&nbsp;
                        <span className={styles.googleAccountBold}>
                            Google Account
                        </span>
                    </button> */} {/* To change or customise  */}
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginFailed}
                    />
                    <p className={styles.orText}>or</p>
                    <form className={styles.loginForm} onSubmit={handleLogin}>
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
                        <button
                            className={styles.loginButton}
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                </div>
                <div className={styles.topMobile}>
                    <p className={styles.dodoNameMobile}>DoDo</p>
                    <hr className={styles.hrLineMobile}></hr>
                </div>
                <div className={styles.bottomBlock}></div>
            </div>
        </div>
    );
}

export default Login;