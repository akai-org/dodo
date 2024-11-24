export type LocationStore = LocationState & LocationStoreFunction;

export interface LocationState {
    path: string;
};

export interface LocationStoreFunction {
    setLocationPath: (newPath: string) => void;
};

