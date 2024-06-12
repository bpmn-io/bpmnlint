export type ModdleElement = any;

export type EnterFn = (element: ModdleElement) => boolean | null;

export type LeaveFn = (element: ModdleElement) => void;