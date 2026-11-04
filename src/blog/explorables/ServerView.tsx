import './explorables.css';
import React, { useEffect, useId, useRef, useState } from 'react';
import {
  type ClipHeader,
  type DemoKeys,
  decodeHeader,
  dedupeTag,
  demoKeys,
  encodeHeader,
  openClip,
  sealClip,
} from './clipsync-crypto';

const ACCOUNT = 'acct_example';
const COPIED_AT = Date.UTC(2026, 10, 4, 9, 30);

// Sealed once with the same code and a throwaway key, so the figure shows a
// real envelope before (or without) JavaScript. The live one replaces it.
const SAMPLE = {
  text: 'The wifi password is on the fridge.',
  envelope:
    'v2.eyJkIjoiZGV2X2xhcHRvcCIsInQiOjE3OTM3ODQ2MDAwMDAsImsiOiJ0ZXh0In0.3f5TJs7flmnXjcs7.a7uqivPsEFxEI6jC8fg7u147CPy4f-OAjGQg-kYxFC_xDHxNCscT32IavG79M5jS04Ka',
  tag: '1gMdYHXiAMI4DhaL75fCSZShT-OId3qmTQO3SNs-77A',
};

type Outcome = { kind: 'opened'; text: string } | { kind: 'refused' };

const describe = (h: ClipHeader) =>
  `device ${h.d}, copied ${new Date(h.t).toISOString().slice(11, 16)} UTC, type ${h.k}`;

/** Type a clip; watch what ClipSync's server would store, then try to forge its header. */
export const ServerView: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const inputId = useId();
  const [text, setText] = useState(SAMPLE.text);
  const [sealed, setSealed] = useState(SAMPLE.envelope);
  const [tag, setTag] = useState(SAMPLE.tag);
  const [forged, setForged] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>({ kind: 'opened', text: SAMPLE.text });
  const keys = useRef<DemoKeys | null>(null);
  const sealRun = useRef(0);
  const openRun = useRef(0);

  // What the server holds: the sealed envelope, or the same envelope with only
  // its header swapped, so the IV and ciphertext stay byte for byte the same.
  const [version, header, iv, ciphertext] = sealed.split('.');
  const storedHeader = forged ? encodeHeader({ ...decodeHeader(header), d: 'dev_server' }) : header;
  const stored = [version, storedHeader, iv, ciphertext].join('.');

  // Reseal on every keystroke. The run counters drop results that land out of order.
  useEffect(() => {
    const id = ++sealRun.current;
    void (async () => {
      keys.current ??= await demoKeys();
      const next = await sealClip(
        keys.current,
        ACCOUNT,
        { d: 'dev_laptop', t: COPIED_AT, k: 'text' },
        text
      );
      const nextTag = await dedupeTag(keys.current, text);
      if (id !== sealRun.current) return;
      setSealed(next);
      setTag(nextTag);
    })();
  }, [text]);

  // The phone opens whatever the server hands it. The sample shown before the
  // keys exist was sealed under another key, so wait for the first live seal.
  useEffect(() => {
    if (!keys.current) return;
    const id = ++openRun.current;
    void openClip(keys.current, ACCOUNT, stored).then(
      (plain) => id === openRun.current && setOutcome({ kind: 'opened', text: plain }),
      () => id === openRun.current && setOutcome({ kind: 'refused' })
    );
  }, [stored]);

  return (
    <div className={compact ? 'sv-frame sv-compact' : 'sv-frame'}>
      <div className="sv">
        <div className="sv-pane">
          <label className="sv-label" htmlFor={inputId}>
            On your laptop
          </label>
          <textarea
            id={inputId}
            className="sv-input"
            rows={compact ? 2 : 3}
            maxLength={280}
            spellCheck={false}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <p className="sv-hint">
            Sealed in this tab under a key made when the page loaded. Nothing you type leaves it.
          </p>
        </div>

        <div className="sv-pane sv-server">
          <p className="sv-label">What the server stores</p>
          <dl className="sv-parts">
            <div>
              <dt>Version</dt>
              <dd>
                <code>{version}</code>
              </dd>
            </div>
            <div className={forged ? 'sv-changed' : undefined}>
              <dt>Header</dt>
              <dd>
                <code>{storedHeader}</code>
                <span className="sv-decoded">
                  {describe(decodeHeader(storedHeader))}
                  {forged && ', rewritten by the server'}
                </span>
              </dd>
            </div>
            <div>
              <dt>IV</dt>
              <dd>
                <code>{iv}</code>
              </dd>
            </div>
            <div>
              <dt>Ciphertext</dt>
              <dd>
                <code>{ciphertext}</code>
              </dd>
            </div>
            <div>
              <dt>Dedupe tag</dt>
              <dd>
                <code>{tag}</code>
              </dd>
            </div>
          </dl>

          <div className="sv-verdict">
            <p role="status" className={outcome.kind === 'refused' ? 'sv-refused' : undefined}>
              {outcome.kind === 'opened' && <>Your phone opens it: “{outcome.text}”</>}
              {outcome.kind === 'refused' && (
                <>
                  Your phone refuses it. The header now names another device, and AES-GCM checked
                  the header too.
                </>
              )}
            </p>
            <button type="button" className="sv-button" onClick={() => setForged((f) => !f)}>
              {forged ? 'Restore the header' : 'Forge the header'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
