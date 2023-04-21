declare module 'typeit' {
  class TypeItInstance {
      break() {
        throw new Error('Method not implemented.');
      }
      constructor(element: string, options?: any);
      type(text: string | string[]): TypeItInstance;
      go(): TypeItInstance;
      destroy(): TypeItInstance;
  }
  export default TypeItInstance;
}