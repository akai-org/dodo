import { create } from "zustand";
import { AuthState, AuthStore } from "./auth.store.types.ts";

const initialValues: AuthState['auth'] = {
    isAuthenticated: false,
    isLoading: false,
}

const useAuthStore = create<AuthStore>((set) =>({
    auth: { ...initialValues },
    setIsAuthenticated: (isAuthenticated: boolean) => set((state) => ({ auth: { ...state.auth, isAuthenticated } })),
    setIsLoading: (isLoading: boolean) => set((state) => ({ auth: { ...state.auth, isLoading } })),
}))

export default useAuthStore;