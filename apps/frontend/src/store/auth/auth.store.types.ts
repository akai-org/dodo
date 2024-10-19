export type AuthStore = AuthState & AuthStoreFunction

export interface AuthState {
    isAuthenticated: boolean;
}
export interface AuthStoreFunction {
    setIsAuthenticated(isAuthenticated: boolean): void;
}