import React, { useId, useRef, useState } from 'react';
import { toBase64Url } from './clipsync-crypto';

const enc = new TextEncoder();
const ROUNDS = [1_000, 100_000, 600_000] as const;

interface Rung {
  passphrase: string;
  rounds: number;
  ms: number;
  master: string;
  proof: string;
  wrapped: string;
}

const short = (bytes: Uint8Array) => `${toBase64Url(bytes).slice(0, 16)}…`;

/** The same ladder as ClipSync's packages/crypto: PBKDF2, then HKDF into a KEK and a proof. */
async function climb(
  passphrase: string,
  rounds: number,
  salt: Uint8Array<ArrayBuffer>,
  vaultKey: Uint8Array<ArrayBuffer>
): Promise<Rung> {
  const material = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase.normalize('NFKC')),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const started = performance.now();
  const master = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: rounds },
      material,
      256
    )
  );
  const ms = performance.now() - started;
  const source = await crypto.subtle.importKey('raw', master, 'HKDF', false, [
    'deriveKey',
    'deriveBits',
  ]);
  const hkdf = (info: string) =>
    ({ name: 'HKDF', hash: 'SHA-256', salt, info: enc.encode(info) }) as const;
  const kek = await crypto.subtle.deriveKey(
    hkdf('clipsync:kek:v1'),
    source,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const proof = new Uint8Array(
    await crypto.subtle.deriveBits(hkdf('clipsync:auth:v1'), source, 256)
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, kek, vaultKey)
  );
  return {
    passphrase,
    rounds,
    ms,
    master: short(master),
    proof: short(proof),
    wrapped: `k1.${toBase64Url(iv)}.${toBase64Url(wrapped).slice(0, 16)}…`,
  };
}

/** Derive the ladder on the reader's own device, then change the passphrase and see what moves. */
export const KeyLadder: React.FC = () => {
  const inputId = useId();
  const roundsId = useId();
  const [passphrase, setPassphrase] = useState('correct horse battery staple');
  const [roundsIndex, setRoundsIndex] = useState(2);
  const [busy, setBusy] = useState(false);
  const [rungs, setRungs] = useState<Rung[]>([]);
  const [vault, setVault] = useState('32 random bytes, made on first derive');
  const secrets = useRef<{
    salt: Uint8Array<ArrayBuffer>;
    vaultKey: Uint8Array<ArrayBuffer>;
  } | null>(null);

  const derive = async () => {
    setBusy(true);
    secrets.current ??= {
      salt: crypto.getRandomValues(new Uint8Array(16)),
      vaultKey: crypto.getRandomValues(new Uint8Array(32)),
    };
    const rung = await climb(
      passphrase,
      ROUNDS[roundsIndex],
      secrets.current.salt,
      secrets.current.vaultKey
    );
    setRungs((previous) => [rung, ...previous].slice(0, 2));
    setVault(short(secrets.current.vaultKey));
    setBusy(false);
  };

  const [now, before] = rungs;

  return (
    <div className="kl">
      <div className="kl-controls">
        <div className="kl-field">
          <label htmlFor={inputId}>Passphrase</label>
          <input
            id={inputId}
            className="sv-input kl-input"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="kl-field">
          <label htmlFor={roundsId}>
            PBKDF2 rounds: {ROUNDS[roundsIndex].toLocaleString('en-GB')}
          </label>
          <input
            id={roundsId}
            className="kl-range"
            type="range"
            min={0}
            max={ROUNDS.length - 1}
            step={1}
            value={roundsIndex}
            onChange={(event) => setRoundsIndex(Number(event.target.value))}
          />
        </div>
        <button
          type="button"
          className="sv-button"
          onClick={() => void derive()}
          disabled={busy || !passphrase}
        >
          {busy ? 'Deriving…' : rungs.length ? 'Derive again' : 'Derive the keys'}
        </button>
      </div>

      <dl className="sv-parts kl-ladder">
        <div>
          <dt>PBKDF2-SHA256</dt>
          <dd>
            {now
              ? `${now.rounds.toLocaleString('en-GB')} rounds in ${Math.round(now.ms)} ms on this device`
              : 'not run yet'}
          </dd>
        </div>
        <div className={now && before && now.master !== before.master ? 'sv-changed' : undefined}>
          <dt>Master key</dt>
          <dd>
            <code>{now?.master ?? '…'}</code>
          </dd>
        </div>
        <div className={now && before && now.proof !== before.proof ? 'sv-changed' : undefined}>
          <dt>Sign-in proof</dt>
          <dd>
            <code>{now?.proof ?? '…'}</code>
            <span className="sv-decoded">The server keeps only a hash of this.</span>
          </dd>
        </div>
        <div className={now && before ? 'sv-changed' : undefined}>
          <dt>Wrapped vault key</dt>
          <dd>
            <code>{now?.wrapped ?? '…'}</code>
          </dd>
        </div>
        <div>
          <dt>Vault key</dt>
          <dd>
            <code>{vault}</code>
            <span className="sv-decoded">
              {now && before
                ? 'Unchanged, so no clip in your history is re-encrypted.'
                : 'Seals every clip. Never derived from the passphrase.'}
            </span>
          </dd>
        </div>
      </dl>
      <p role="status" className="sv-hint">
        {now && before
          ? `Derived again with “${now.passphrase}”. Marked rows changed; the vault key did not.`
          : now
            ? 'Now change the passphrase and derive again.'
            : 'Runs on your device with WebCrypto. Nothing is sent anywhere.'}
      </p>
    </div>
  );
};
