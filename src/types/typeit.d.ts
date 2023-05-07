declare module 'typeit' {
  class TypeItInstance {
      getPauseDuration(arg0: boolean): number | undefined {
        throw new Error('Method not implemented.');
      }
      options: any;
    hasBeenTyped: any;
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