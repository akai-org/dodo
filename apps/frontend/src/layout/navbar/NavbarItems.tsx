
import { RiHomeLine } from "react-icons/ri";
import { RiCalendarLine } from "react-icons/ri";
import { RiFileList2Line } from "react-icons/ri";
import { RiBookletLine } from "react-icons/ri";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { RiSettings4Line } from "react-icons/ri";



export const NavbarItems = [
    {
        name: 'Home',
        link: '/home',
        icon: <RiHomeLine/>,
    },
    {
        name: 'Calendar',
        link: '/calendar',
        icon: <RiCalendarLine/>,
    },
    {
        name: 'ToDo List',
        link: '/todolist',
        icon: <RiFileList2Line/>
    },
    {
        name: 'Notes',
        link: '/notes',
        icon: <RiBookletLine/>,
    },
    {
        name: 'Categories',
        link: '/categories',
        icon: <RiBarChartHorizontalLine/>,
    },
    {
        name: 'Settings',
        link: '/settings/themes',
        icon: <RiSettings4Line/>
    },
];