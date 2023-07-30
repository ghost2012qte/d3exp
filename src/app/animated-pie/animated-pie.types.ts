export type IDataKeyAccessor<T> = (d: T, i: number, data: readonly T[]) => string | number;

export type IDataValueAccessor<T> = (d: T, i: number, data: readonly T[]) => number;

export type IProgressExtended<T, P> = T & { __progress__: P };