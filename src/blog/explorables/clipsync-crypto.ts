// The parts of ClipSync's clip envelope the post demonstrates, ported from
// packages/crypto/src/index.ts in robavelii/clipboard-worker: the same HKDF
// info strings, the same v2 envelope and the same associated data. Only
// WebCrypto, so it runs in the reader's browser and nothing leaves the page.

const enc = new TextEncoder();
const dec = new TextDecoder();

export const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

export const fromBase64Url = (text: string) => {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

export interface DemoKeys {
  enc: CryptoKey;
  dedupe: CryptoKey;
}

const hkdf = (salt: Uint8Array<ArrayBuffer>, info: string) =>
  ({ name: 'HKDF', hash: 'SHA-256', salt, info: enc.encode(info) }) as const;

/** A fresh random vault key and the two keys ClipSync derives from it. */
export async function demoKeys(): Promise<DemoKeys> {
  const vaultKey = crypto.getRandomValues(new Uint8Array(32));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const source = await crypto.subtle.importKey('raw', vaultKey, 'HKDF', false, ['deriveKey']);
  const [encKey, dedupeKey] = await Promise.all([
    crypto.subtle.deriveKey(
      hkdf(salt, 'clipsync:enc:v1'),
      source,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    ),
    crypto.subtle.deriveKey(
      hkdf(salt, 'clipsync:dedupe:v1'),
      source,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
  ]);
  return { enc: encKey, dedupe: dedupeKey };
}

export interface ClipHeader {
  d: string;
  t: number;
  k: string;
}

const aad = (account: string, header: string) =>
  enc.encode(`clipsync:clip:v2:${account}:${header}`);

/** `v2.<header>.<iv>.<ciphertext>`, all base64url, header bound as associated data. */
export async function sealClip(keys: DemoKeys, account: string, header: ClipHeader, text: string) {
  const encodedHeader = toBase64Url(enc.encode(JSON.stringify(header)));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, additionalData: aad(account, encodedHeader) },
      keys.enc,
      enc.encode(text)
    )
  );
  return `v2.${encodedHeader}.${toBase64Url(iv)}.${toBase64Url(ct)}`;
}

/** Throws when the key, the account or any byte of the header or ciphertext is wrong. */
export async function openClip(keys: DemoKeys, account: string, envelope: string) {
  const [, encodedHeader, iv, ct] = envelope.split('.');
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64Url(iv), additionalData: aad(account, encodedHeader) },
    keys.enc,
    fromBase64Url(ct)
  );
  return dec.decode(pt);
}

/** The server-visible dedupe tag: an HMAC, so a stolen database can't confirm a guess. */
export async function dedupeTag(keys: DemoKeys, text: string) {
  return toBase64Url(
    new Uint8Array(await crypto.subtle.sign('HMAC', keys.dedupe, enc.encode(text)))
  );
}

export const decodeHeader = (encodedHeader: string): ClipHeader =>
  JSON.parse(dec.decode(fromBase64Url(encodedHeader)));

export const encodeHeader = (header: ClipHeader) => toBase64Url(enc.encode(JSON.stringify(header)));
