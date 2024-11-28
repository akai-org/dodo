import { useState, useLayoutEffect, useEffect, ReactElement } from 'react';

import styles from './Navbar.module.scss';

import { NavbarItems } from './NavbarItems.tsx';
import { NavbarModuleParent } from './navbarmodule/NavbarModule.tsx';
import { RiMenuFill } from 'react-icons/ri';
import { RiCloseFill } from 'react-icons/ri';
import { RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { Route } from '../../router/router.types.ts';
import NavbarProfile from './NavbarProfile/NavbarProfile.tsx';

// CONSTANTS
const FULL_MENU_BREAKPOINT = 1024;
const SHORT_MENU_BREAKPOINT = 768;

const COLLAPSE_ICON = <RiCloseFill />;
const EXPAND_ICON = <RiMenuFill />;

export interface Mode {
    class: string;
    number: number;
    icon: ReactElement;
}

// Description of modes:
// 0 - without menu (class 'hide'), 1 - mobile menu (class 'mobile'), 2 - short menu (class 'short'), 3 - full menu (without additional class)
const translateMenuObject = (modeNumber: number) => {
    switch (modeNumber) {
        case 0:
            return { class: styles.hide, number: 0, icon: EXPAND_ICON };
        case 1:
            return { class: styles.mobile, number: 1, icon: COLLAPSE_ICON };
        case 2:
            return { class: styles.short, number: 2, icon: EXPAND_ICON };
        case 3:
            return { class: '', number: 3, icon: COLLAPSE_ICON };
    }
};

const initializeMenu = (): Mode => {
    if (window.innerWidth >= FULL_MENU_BREAKPOINT)
        return translateMenuObject(3)!;
    else if (window.innerWidth >= SHORT_MENU_BREAKPOINT)
        return translateMenuObject(2)!;
    else return translateMenuObject(0)!;
};

const Navbar = () => {
    const location = window.location;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [mode, setMode] = useState<Mode>(initializeMenu());

    const fitModeClass = () => {
        if (windowWidth >= FULL_MENU_BREAKPOINT)
            setMode(translateMenuObject(3)!);
        else if (windowWidth >= SHORT_MENU_BREAKPOINT)
            setMode(translateMenuObject(2)!);
        else setMode(translateMenuObject(0)!);
    };

    const handleMenuModeClick = () => {
        switch (mode.number) {
            case 0:
                setMode(translateMenuObject(1)!);
                break;
            case 1:
                setMode(translateMenuObject(0)!);
                break;
            case 2:
                setMode(translateMenuObject(3)!);
                break;
            case 3:
                setMode(translateMenuObject(2)!);
                break;
        }
    };

    const handleMenuClose = () => {
        if (mode.number === 1) setMode(translateMenuObject(0)!);
    };

    useLayoutEffect(() => {
        fitModeClass();
    }, [windowWidth]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth !== windowWidth)
                setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <>
            <div className={`${styles.top}  ${styles[mode.class]}`}>
                <div className={`${styles.upperContainer}  ${mode.class}`}>
                    <div className={`${styles.logoContainer}  ${mode.class}`}>
                        <a
                            href={Route.HOME}
                            className={`${styles.logoImageLink}  ${mode.class}`}
                        >
                            <div
                                className={`${styles.logoImage}  ${mode.class}`}
                            >
                                <RiCheckboxBlankCircleLine />
                            </div>
                        </a>
                        <a href={Route.HOME}>
                            <div
                                className={`${styles.logoAppName} ${mode.class}`}
                            >
                                DoDo
                            </div>
                        </a>
                    </div>

                    <div
                        className={`${styles.menuIcon}  ${mode.class}`}
                        onClick={handleMenuModeClick}
                    >
                        {mode.icon}
                    </div>
                </div>
                <NavbarModuleParent modeClass={mode.class} />
            </div>

            <nav className={`${styles.side} ${mode.class}`}>
                <div className={`${styles.menuContainer} ${mode.class}`}>
                    <ul className={`${styles.menuList}  ${mode.class}`}>
                        {NavbarItems.map((item, index) => {
                            const isActive =
                                location.pathname.split('/')[1] ===
                                item.link.split('/')[1];

                            const activeStyle = {
                                style: {
                                    backgroundColor: 'var(--darkgray-color)',
                                    color: 'var(--contrastbg-color)',
                                },
                            };

                            return (
                                <div
                                    key={index}
                                    className={`${styles.menuListWrapper} ${mode.class}`}
                                >
                                    <li
                                        key={index}
                                        className={`${styles.menuItem} ${mode.class}`}
                                    >
                                        <a
                                            href={item.link}
                                            className={`${styles.menuLink} ${mode.class}`}
                                            onClick={handleMenuClose}
                                        >
                                            <div
                                                className={`${styles.menuLinkIcon} ${mode.class}`}
                                                {...(isActive && activeStyle)}
                                            >
                                                {item.icon}
                                            </div>
                                            <div
                                                className={`${styles.menuLinkTag} ${mode.class}`}
                                            >
                                                {item.name}
                                            </div>
                                        </a>
                                    </li>
                                    {isActive && (
                                        <div
                                            className={`${styles.menuItemActive} ${mode.class}`}
                                        ></div>
                                    )}
                                </div>
                            );
                        })}
                    </ul>
                </div>
                <NavbarProfile mode={mode} />
            </nav>
        </>
    );
};

export default Navbar;
