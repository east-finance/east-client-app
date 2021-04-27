/// <reference types="react-scripts" />

declare module '*.ttf';
declare module '*.eot';

declare namespace WEWallet {
  type TWalletApi = {
    auth(data: IAuthData): Promise<IAuthResponse>;
    publicState(): Promise<IPublicStateResponse>;
    initialPromise() : Promise<any>;
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
