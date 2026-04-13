import * as bcrypt from 'bcrypt';

export async function hashRefreshToken(
  refreshToken: string,
  saltRounds = 12,
): Promise<string> {
  return bcrypt.hash(refreshToken, saltRounds);
}

export async function compareRefreshToken(
  plainRefreshToken: string,
  hashedRefreshToken: string,
): Promise<boolean> {
  return bcrypt.compare(plainRefreshToken, hashedRefreshToken);
}