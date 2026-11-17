/** Strip control characters / angle brackets and collapse whitespace. */
export function clean(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u001f\u007f<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export const looksLikeLink = (s: string) => /(https?:\/\/|www\.|\.[a-z]{2,}\/)/i.test(s);
