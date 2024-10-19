import {FC, ReactElement} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './Settings.module.scss';

import {NavbarModule} from "../../layout/navbar/navbarmodule/NavbarModule.tsx";

const folds = [
    {
        title: 'Themes',
        url: 'themes',
    },
    {
        title: 'Calendar',
        url: 'calendar',
    },
    {
        title: 'ToDo List',
        url: 'todolist',
    },
    {
        title: 'Notes',
        url: 'notes',
    },
    {
        title: 'Profile',
        url: 'profile',
    },
];

const foldTitles = folds.map((fold) => fold.title);
const foldUrls = folds.map((fold) => fold.url);

interface SettingsProps {
    children: ReactElement;
}

const Settings: FC<SettingsProps> = ({children}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentFold =  location.pathname.split('/').pop();


    const navbarElements = foldTitles.map((element, index, array) => (
        <div className={styles.elementWithPipe} key={index}>
            <button
                className={`${styles.navbarElement} ${
                    currentFold === foldUrls[index]
                        ? styles.activeNavbarElement
                        : ''
                }`}
                onClick={() => navigate('/settings/'+foldUrls[index])}
            >
                {element}
            </button>
            {index !== array.length - 1 && (
                <div className={styles.navbarPipe}></div>
            )}
        </div>
    ));

    return (
        <div>
            <NavbarModule>
                <div className={styles.navbar}>{navbarElements}</div>
            </NavbarModule>
            <div className={styles.container}>
                {children}
            </div>
        </div>
    );
};

export default Settings;