import { createBrowserRouter } from 'react-router-dom';
import { Route, SETTINGS_PATH } from './router.types.ts';
import Home from '../pages/home/Home.tsx';
import Calendar from '../pages/calendar/Calendar.tsx';
import Notes from '../pages/notes/Notes.tsx';
import NotFound from '../pages/notfound/NotFound.tsx';
import Login from '../pages/login/Login.tsx';
import { withGuard } from '../auth/Guard.tsx';
import ThemesFold from '../pages/settings/ThemesFold/ThemesFold.tsx';
import CalendarFold from '../pages/settings/CalendarFold.tsx';
import ToDoListFold from '../pages/settings/ToDoListFold.tsx';
import NotesFold from '../pages/settings/NotesFold.tsx';
import ProfileFold from '../pages/settings/ProfileFold.tsx';
import ToDoList from '../pages/todolist/ToDoList.tsx';
import Register from '../pages/register/Register.tsx';

export const router = createBrowserRouter([
    {
        path: Route.BASE,
        element: withGuard(<Home />),
    },
    {
        path: Route.HOME,
        element: withGuard(<Home />),
    },
    {
        path: Route.CALENDAR,
        element: withGuard(<Calendar />),
    },
    {
        path: Route.CATEGORIES,
        element: withGuard(<Home />),
    },
    {
        path: Route.TODOLIST,
        element: withGuard(<ToDoList />),
    },
    {
        path: Route.NOTES,
        element: withGuard(<Notes />),
    },
    {
        path: Route.SETTINGS,
        children: [
            {
                path: Route.SETTINGS + SETTINGS_PATH.THEMES,
                element: withGuard(<ThemesFold />),
            },
            {
                path: Route.SETTINGS + SETTINGS_PATH.CALENDAR,
                element: withGuard(<CalendarFold />),
            },
            {
                path: Route.SETTINGS + SETTINGS_PATH.TODOLIST,
                element: withGuard(<ToDoListFold />),
            },
            {
                path: Route.SETTINGS + SETTINGS_PATH.NOTES,
                element: withGuard(<NotesFold />),
            },
            {
                path: Route.SETTINGS + SETTINGS_PATH.PROFILE,
                element: withGuard(<ProfileFold />),
            },
        ],
    },
    {
        path: Route.LOGIN,
        element: withGuard(<Login />),
    },
    {
        path: Route.REGISTER,
        element: withGuard(<Register />),
    },
    {
        path: Route.NOT_FOUND,
        element: withGuard(<NotFound />),
    },
]);
