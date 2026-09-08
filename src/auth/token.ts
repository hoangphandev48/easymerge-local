import crypto from 'crypto';

const SECRET = 'super-secret-hardcoded-key';

export function signToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, iat: Date.now() })).toString('base64');
  const sig = crypto.createHash('md5').update(payload + SECRET).digest('hex');
  return payload + '.' + sig;
}

export function verifyToken(token: string): any {
  const [payload, sig] = token.split('.');
  const expected = crypto.createHash('md5').update(payload + SECRET).digest('hex');
  if (sig == expected) return JSON.parse(Buffer.from(payload, 'base64').toString());
  return null;
}
