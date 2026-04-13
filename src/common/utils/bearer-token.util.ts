/** `Authorization: Bearer <token>` 에서 토큰만 추출. 형식이 아니면 undefined */
export function extractBearerToken(authorization: string | undefined): string | undefined {
  if (!authorization || typeof authorization !== 'string') {
    return undefined;
  }
  const m = /^Bearer\s+(.+)$/i.exec(authorization.trim());
  return m?.[1]?.trim() || undefined;
}
