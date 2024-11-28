import { FC, ReactElement, useEffect, useState } from 'react';

import styles from './NavbarProfile.module.scss';

import { Mode } from '../Navbar';
import useAuthApi from '../../../api/useAuthApi';
import { removeAccessToken } from '../../../auth/auth.utils';

interface NavbarProfileProps {
    mode: Mode;
}

const NavbarProfile: FC<NavbarProfileProps> = ({ mode }): ReactElement => {
    const { useCurrentUser } = useAuthApi();
    const { data: user } = useCurrentUser();
    const [profileMode, setProfileMode] = useState({
        class: '',
    });
    useEffect(() => {
        switch (mode.number) {
            case 0:
                setProfileMode({ class: styles.hide });
                break;
            case 1:
                setProfileMode({ class: styles.mobile });
                break;
            case 2:
                setProfileMode({ class: styles.short });
                break;
            case 3:
                setProfileMode({ class: '' });
                break;
        }
    }, [mode]);
    return (
        <div className={`${styles.userContainer} ${profileMode.class}`}>
            <div
                className={`${styles.logoutBackgroundSnippet} ${profileMode.class}`}
            >
                <div
                    className={`${styles.logoutBackground} ${profileMode.class}`}
                >
                    <div
                        onClick={removeAccessToken}
                        className={`${styles.userLogout} ${profileMode.class}`}
                    >
                        LOGOUT
                    </div>
                </div>
                <div
                    className={`${styles.userInfoContainer} ${profileMode.class}`}
                >
                    <div className={`${styles.userLogo} ${profileMode.class}`}>
                        AV
                    </div>
                    <div
                        className={`${styles.userTextContainer} ${profileMode.class}`}
                    >
                        <div
                            className={`${styles.line} ${profileMode.class}`}
                        ></div>
                        <div
                            className={`${styles.userName} ${profileMode.class}`}
                        >
                            {user?.username ?? ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarProfile;
