const pathsMap = {

  // public

  home: () => '/',
  authorites: () => '/authorities',
  verify: () => '/verify',
  // editArticle: (articleId: string) => `/articles/${articleId}/edit`,

  // private

  createAccount: () => '/createAccount',
  signIn: () => '/signIn',
  account: () => '/account',
  becomeAuthority: () => '/account/becomeAuthority',
  createFeatType: () => '/account/createFeatType',
  award: (featTypeId: string) => `/account/award/${featTypeId}`,
};

type PathsMap = typeof pathsMap;

export const getPath = <TRoute extends keyof PathsMap>(
  route: TRoute,
  ...params: Parameters<PathsMap[TRoute]>
) => {
  const pathCb: (...args: any[]) => string = pathsMap[route];

  return pathCb(...params);
};
