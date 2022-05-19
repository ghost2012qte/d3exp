export type IDatasetMapperFn<T> = (value: Readonly<Record<string, string>>) => Readonly<T>;

export type IDatasetParserFn = (value: string) => Record<string, string>[];

export interface IExampleSimple {
  x: number
  y: number
}

export interface IExampleMultiple {
  x: number
  y1: number
  y2: number
}

export interface IExampleDense {
  A: number
  B: number
  C: number
}
