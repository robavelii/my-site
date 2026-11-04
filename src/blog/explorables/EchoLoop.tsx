import './explorables.css';
import React, { useEffect, useRef, useState } from 'react';

type Device = 'laptop' | 'phone';
const OTHER: Record<Device, Device> = { laptop: 'phone', phone: 'laptop' };
const STEP_LIMIT = 12;

interface Event {
  id: number;
  text: string;
  quiet?: boolean;
}

/**
 * A step-by-step model of §7 in ClipSync's decisions: a device that writes a
 * received clip sees its own clipboard change. Without the guards the clip
 * bounces between devices; the tag guard is the one that ends it.
 */
function simulate(originGuard: boolean, tagGuard: boolean): Event[] {
  const events: Event[] = [];
  const say = (text: string, quiet?: boolean) => events.push({ id: events.length, text, quiet });
  // Each entry: a clipboard change on a device, and whether sync caused it.
  const queue: { device: Device; applied: boolean }[] = [{ device: 'laptop', applied: false }];
  say('You copy a link on the laptop.');
  while (queue.length && events.length < STEP_LIMIT) {
    const { device, applied } = queue.shift()!;
    if (applied && tagGuard) {
      say(`The ${device} recognises the tag of the clip it just wrote and stays quiet.`, true);
      continue;
    }
    say(`The ${device} sees a new clip and uploads it.`);
    const targets: Device[] = originGuard ? [OTHER[device]] : [OTHER[device], device];
    for (const target of targets) {
      if (target === device) say(`The server sends it back to the ${device} as well.`);
      else say(`The server fans it out to the ${target}, which writes it to its clipboard.`);
      queue.push({ device: target, applied: true });
    }
  }
  if (queue.length) say('…and so on, forever.');
  return events;
}

/** Copy once and watch where the clip goes, with each guard on or off. */
export const EchoLoop: React.FC = () => {
  const [originGuard, setOriginGuard] = useState(false);
  const [tagGuard, setTagGuard] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [shown, setShown] = useState(0);
  const timer = useRef<number>(0);

  // Reveal one step at a time; all at once when the reader asked for less motion.
  useEffect(() => {
    if (shown >= events.length) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = window.setTimeout(
      () => setShown(reduced ? events.length : shown + 1),
      reduced ? 0 : 450
    );
    return () => window.clearTimeout(timer.current);
  }, [shown, events]);

  const run = () => {
    setEvents(simulate(originGuard, tagGuard));
    setShown(0);
  };

  const uploads = events.slice(0, shown).filter((e) => e.text.includes('uploads')).length;
  const done = events.length > 0 && shown >= events.length;

  return (
    <div className="el">
      <fieldset className="el-guards">
        <legend>Guards</legend>
        <label>
          <input
            type="checkbox"
            checked={originGuard}
            onChange={(e) => setOriginGuard(e.target.checked)}
          />
          Never send a clip back to the device it came from
        </label>
        <label>
          <input
            type="checkbox"
            checked={tagGuard}
            onChange={(e) => setTagGuard(e.target.checked)}
          />
          Remember the tag of the last clip sent or written
        </label>
        <button type="button" className="sv-button" onClick={run}>
          Copy on the laptop
        </button>
      </fieldset>

      <div className="el-log">
        <ol aria-live="polite">
          {events.slice(0, shown).map((event) => (
            <li key={event.id} className={event.quiet ? 'el-quiet' : undefined}>
              {event.text}
            </li>
          ))}
        </ol>
        <p className="sv-hint">
          {events.length === 0
            ? 'Pick the guards, then copy.'
            : done
              ? events.at(-1)?.text.startsWith('…')
                ? `${uploads} uploads so far, and no end to it.`
                : `${uploads} upload${uploads === 1 ? '' : 's'} for one copy.`
              : 'Running…'}
        </p>
      </div>
    </div>
  );
};
