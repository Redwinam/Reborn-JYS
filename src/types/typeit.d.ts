declare module 'typeit' {
  class TypeItInstance {
      constructor(element: string, options?: any);
      type(text: string | string[]): TypeItInstance;
      go(): TypeItInstance;
      destroy(): TypeItInstance;
  }
  export default TypeItInstance;
}