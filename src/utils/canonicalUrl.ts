export const canonicalUrl = (path: string) => {
  path = path.startsWith("/") ? path : `/${path}`;
  return `https://o-ful.vercel.app${path}`;
};
