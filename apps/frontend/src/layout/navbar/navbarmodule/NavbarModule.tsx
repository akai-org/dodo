import React, {FC, useEffect, forwardRef, useRef, useState} from 'react';
import {createPortal} from "react-dom";

const NAVBAR_ID = 'navbar';

type NavbarModuleProps = {
    children?: React.ReactNode;
};

const NavbarModule: FC<NavbarModuleProps> = ({ children }) => {
    const navbar = useRef<HTMLElement | null>(null);
    const [, forceUpdate] = useState({});

    useEffect(() => {
        navbar.current = document.getElementById(NAVBAR_ID);
        forceUpdate({});
    }, []);

    return navbar.current ? createPortal(children, navbar.current.parentElement!) : null;
};
type NavbarModuleParentProps = {
    children?: React.ReactNode;
    modeClass?: string;
};

const NavbarModuleParent = forwardRef<HTMLDivElement, NavbarModuleParentProps>(({ children, modeClass }, ref) => (
    <nav ref={ref} id={NAVBAR_ID} className={`customModuleContainer ${modeClass}`}>
        {children}
    </nav>
));

export { NavbarModule, NavbarModuleParent };
export default NavbarModuleParent;
