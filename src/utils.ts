export type updateState<S> = (state: Readonly<S>) => Partial<S>;

export const isFunction = (value: any): value is () => void => {
  return typeof value === 'function';
};
