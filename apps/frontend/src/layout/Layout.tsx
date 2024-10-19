import {FC, ReactElement, useEffect, useState} from "react";
import ScrollableContainer from "./scrollablecontainer/ScrollableContainer.tsx";
import Navbar from "./navbar/Navbar.tsx";
import useThemeStore from "../store/theme/theme.store.ts";
import {Route} from "../router/router.types.ts";

interface LayoutProps {
    children?: ReactElement;
}

const DISABLE_NAVBAR = [Route.LOGIN]

const Layout: FC<LayoutProps> = ({children}): ReactElement => {

    const route = window.location.pathname;
    const [,forceUpdate] = useState(false);

    useEffect(() => {
        forceUpdate(true);
    }, [route])


    const { theme } = useThemeStore();
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return (<main themestyle={theme.style} thememode={theme.mode}>
                {!DISABLE_NAVBAR.includes(route as Route) && <Navbar/>}
                <ScrollableContainer>
                    {children}
                </ScrollableContainer>
            </main>
    )
}

export default Layout;