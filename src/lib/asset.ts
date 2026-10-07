/** Resolves a /public path against Vite's `base`, so the site also works from a sub-path. */
export const asset = (path: string) =>
  path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path
