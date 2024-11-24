export type AuthStore = AuthState & AuthStoreFunction

export interface AuthState {
    auth: {
        isAuthenticated: boolean;
        isLoading: boolean;
    }
}
export interface AuthStoreFunction {
    setIsAuthenticated(isAuthenticated: boolean): void;
    setIsLoading(isLoading: boolean): void;
}