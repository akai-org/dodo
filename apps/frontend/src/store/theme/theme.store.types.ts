export type ThemeStore = ThemeState & ThemeStoreFunction

type Theme = {
    style: string,
    mode: string,
}

export interface ThemeState {
    theme: Theme
}
export interface ThemeStoreFunction {
   setTheme: (theme: Theme) => void
}