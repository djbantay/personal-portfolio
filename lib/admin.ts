/** Owner-only actions accept ADMIN_TOKEN (or the older GUESTBOOK_ADMIN_TOKEN). */
export function isAdmin(key: string | null | undefined) {
  const token = process.env.ADMIN_TOKEN ?? process.env.GUESTBOOK_ADMIN_TOKEN;
  return !!token && !!key && key === token;
}
