/// <reference types="react-scripts" />

declare module '*.ttf';
declare module '*.eot';

declare module '*.mp4' {
  const src: string
  export default src
}

declare namespace WEWallet {
  type TWalletApi = {
    auth(data: IAuthData): Promise<IAuthResponse>;
    publicState(): Promise<IPublicStateResponse>;
    initialPromise() : Promise<any>;
    getTxId(data: any) : Promise<any>;
    signTransaction(data: any) : Promise<any>;
    signAtomicTransaction(data: any) : Promise<any>;
    broadcastAtomic(data: any) : Promise<any>;
  }

  interface IAuthResponse {
    address: string;
    host: string;
    prefix: string;
    publicKey: string;
    signature: string;
    version: number;
    name: string;
  }

  interface IPublicStateResponse {
    initialized: boolean;
    locked: boolean;
    account: TPublicStateAccount | null;
    network: TPublicStateNetwork,
    messages: Array<TPublicStateMessage>,
    txVersion: Record<number, Array<number>>;
  }
}

interface Window {
  WEWallet: WEWallet.TWalletApi;
}
