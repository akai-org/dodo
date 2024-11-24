import { create } from "zustand";
import { LocationStore } from "./location.store.types";

const initialPathValue: LocationStore['path'] = '/login';

const useLocationStore = create<LocationStore>((set) => ({
    path: initialPathValue,
    setLocationPath: (newPath: string) => set({ path: newPath })
}));

export default useLocationStore;
