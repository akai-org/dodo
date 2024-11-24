import {ThemeState, ThemeStore} from "./theme.store.types.ts";
import {create} from "zustand/index";

const initialValues: ThemeState = {
    theme: {
        style: 'default',
        mode: 'light',
    }
}

const useThemeStore = create<ThemeStore>((set) =>( {
    ...initialValues,
    setTheme(theme) { set(() => ({theme})) }
}))

export default useThemeStore;
