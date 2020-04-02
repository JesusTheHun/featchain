import {FeatTypeId} from "featchain-blockchain";

const pathsMap = {

  // public

  home: () => '/',
  verifyAccount: (address: string = '') => `/verify${address ? '/' + address : ''}`,
  featType: (featTypeId: FeatTypeId) => `/featType/${featTypeId}`,
  authority: (issuerId: string) => `/authority/${issuerId}`,

  // private

  createAccount: () => '/createAccount',
  signIn: () => '/signIn',
  account: () => '/account',
  becomeAuthority: () => '/account/becomeAuthority',
  createFeatType: () => '/account/createFeatType',
  award: (featTypeId: string) => `/account/award/${featTypeId}`,
};

type PathsMap = typeof pathsMap;

export const getPath = <TRoute extends keyof PathsMap>(route: TRoute, ...params: Parameters<PathsMap[TRoute]>) => {
  const pathCb: (...args: any[]) => string = pathsMap[route];
  return pathCb(...params);
};
