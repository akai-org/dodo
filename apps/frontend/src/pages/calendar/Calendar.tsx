import {FC, ReactElement} from "react";
import NavbarModule from "../../layout/navbar/navbarmodule/NavbarModule.tsx";

const Calendar: FC = (): ReactElement => {
    return (<section>
        <NavbarModule>Custom calendar module</NavbarModule>
        Calendar
    </section>)
}

export default Calendar;