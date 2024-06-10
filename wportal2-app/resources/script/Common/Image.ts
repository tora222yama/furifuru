/**
 * 認証画像パスの取得.
 */
export const getAuthorizedImagePath = (src?: string): string => {
  if (!src) {
    return '';
  }
  return `/image/${src}`;
};
