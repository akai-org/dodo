import {FC, ReactElement, useEffect, useState} from "react";
import ScrollableContainer from "./scrollablecontainer/ScrollableContainer.tsx";
import Navbar from "./navbar/Navbar.tsx";
import useThemeStore from "../store/theme/theme.store.ts";
import {Route} from "../router/router.types.ts";
import useAuthStore from "../store/auth/auth.store.ts";

interface LayoutProps {
    children?: ReactElement;
}

const DISABLE_NAVBAR = [Route.LOGIN]

const Layout: FC<LayoutProps> = ({children}): ReactElement => {

    const [forceUpdate, setForceUpdate] = useState(false);
    const { isAuthenticated } = useAuthStore.getState();
    const route = window.location.pathname;
    const isDisabled = DISABLE_NAVBAR.includes(route as Route) || !isAuthenticated;

    useEffect(() => {
        setForceUpdate(!forceUpdate);
    }, [route, isAuthenticated])

    const { theme } = useThemeStore();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return (<main themestyle={theme.style} thememode={theme.mode}>
                {!isDisabled && <Navbar />}
                <ScrollableContainer>
                    {children}
                </ScrollableContainer>
            </main>
    )
}

export default Layout;