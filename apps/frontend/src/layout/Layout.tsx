import { FC, ReactElement } from 'react';
import ScrollableContainer from './scrollablecontainer/ScrollableContainer.tsx';
import Navbar from './navbar/Navbar.tsx';
import useThemeStore from '../store/theme/theme.store.ts';
import useLocationStore from '../store/location/location.store.ts';
import { Route } from '../router/router.types.ts';

interface LayoutProps {
    children?: ReactElement;
}

const DISABLE_NAVBAR = [Route.LOGIN];

const Layout: FC<LayoutProps> = ({ children }): ReactElement => {
    const { theme } = useThemeStore();
    const { path } = useLocationStore();

    const isNavbarVisible = !DISABLE_NAVBAR.includes(path as Route);

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <main themestyle={theme.style} thememode={theme.mode}>
            {isNavbarVisible && <Navbar />}
            <ScrollableContainer>{children}</ScrollableContainer>
        </main>
    );
};

export default Layout;
