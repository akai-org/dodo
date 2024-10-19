import { create } from "zustand";
import { AuthState, AuthStore } from "./auth.store.types.ts";

const initialValues: AuthState = {
    isAuthenticated: false,
}

const useAuthStore = create<AuthStore>()((set) =>( {
    ...initialValues,
    setIsAuthenticated(isAuthenticated: boolean) { set(() => ({isAuthenticated})) }
}))

export default useAuthStore;