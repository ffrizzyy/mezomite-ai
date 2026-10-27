import type { ElementType, ReactNode } from 'react';

type Props = {
  /** The text to split. Rendered word by word, so keep it a plain string. */
  text: string;
  as?: ElementType;
  className?: string;
  /** Milliseconds before the first word starts. Keep under 120ms. */
  delay?: number;
  /** Milliseconds between words. 16 to 24ms reads as one gesture, not 20 events. */
  stagger?: number;
  /** Ceiling on total stagger so a long headline never takes a second. */
  maxStagger?: number;
};

/**
 * React Bits "SplitText", implemented as CSS only.
 *
 * Decisions that matter:
 * - The words are in the server HTML. No JS, so no hydration, no LCP wait.
 * - A visually hidden copy carries the real sentence for assistive tech. The
 *   split words are aria-hidden, so a screen reader reads one sentence rather
 *   than twelve fragments, and the heading keeps a reliable accessible name.
 * - Words are separated by a real space text node between inline-block spans.
 *   A space inside the span would collapse and the headline would read as one
 *   long word.
 * - Only transform and opacity move. Nothing is clipped in a way that would
 *   hide text from find-in-page.
 */
export default function SplitText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = 18,
  maxStagger = 216,
}: Props) {
  const words = text.split(' ');

  return (
    <Tag className={['split-text', className].filter(Boolean).join(' ')}>
      <span className="visually-hidden">{text}</span>
      <span className="split-text__words" aria-hidden="true">
        {words.map((word, index) => {
          const wordDelay = Math.min(index * stagger, maxStagger) + delay;
          return (
            <span key={`${word}-${index}`}>
              <span className="split-text__word">
                <span
                  className="split-text__inner"
                  style={{ animationDelay: `${wordDelay}ms` }}
                >
                  {word}
                </span>
              </span>
              {index < words.length - 1 ? ' ' : null}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

/** Small helper so a headline can mix a plain run and an accented run. */
export function SplitTextPart({ children }: { children: ReactNode }) {
  return <span className="split-text__part">{children}</span>;
}
