import { useEffect, useRef, useState } from "react";

const COUNTDOWN_SECONDS = 5;
const CELEBRATION_SECONDS = 5;
const COUNTDOWN_DURATION_MS = COUNTDOWN_SECONDS * 1000;
const CELEBRATION_DURATION_MS = CELEBRATION_SECONDS * 1000;
const palette = ["#ef7d72", "#f6b37f", "#f3cb62", "#ffefe0", "#df5b68"];
const tags = [
  "Golden hour energy",
  "Good cake decisions",
  "Main character timing"
];

function createConfetti(amount, spread = 2400) {
  return Array.from({ length: amount }, (_, index) => {
    const duration = spread + Math.random() * 1000;
    const variant = index % 3 === 0 ? "square" : index % 2 === 0 ? "slim" : "";

    return {
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      color: palette[Math.floor(Math.random() * palette.length)],
      duration,
      drift: `${(Math.random() - 0.5) * 240}px`,
      left: `${Math.random() * 100}%`,
      spin: `${(Math.random() - 0.5) * 960}deg`,
      variant
    };
  });
}

export default function App() {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [introPhase, setIntroPhase] = useState("countdown");
  const [revealed, setRevealed] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [wished, setWished] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const confettiRainIntervalRef = useRef(null);
  const confettiRainTimeoutRef = useRef(null);

  useEffect(() => {
    const countdownStartedAt = Date.now();

    const countdownTimer = window.setInterval(() => {
      const elapsed = Date.now() - countdownStartedAt;
      const remaining = Math.max(1, COUNTDOWN_SECONDS - Math.floor(elapsed / 1000));
      setCountdown(remaining);
    }, 100);

    const celebrationTimer = window.setTimeout(() => {
      window.clearInterval(countdownTimer);
      setIntroPhase("birthday");
      startConfettiRain(CELEBRATION_DURATION_MS, 10, 220, 2400);
    }, COUNTDOWN_DURATION_MS);

    const revealTimer = window.setTimeout(() => {
      clearConfettiRain();
      setConfetti([]);
      setIntroPhase("site");
      setRevealed(true);
    }, COUNTDOWN_DURATION_MS + CELEBRATION_DURATION_MS);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(celebrationTimer);
      window.clearTimeout(revealTimer);
      clearConfettiRain();
    };
  }, []);

  function burstConfetti(amount, spread) {
    const pieces = createConfetti(amount, spread);

    setConfetti((current) => [...current, ...pieces]);

    pieces.forEach((piece) => {
      window.setTimeout(() => {
        setConfetti((current) => current.filter((entry) => entry.id !== piece.id));
      }, piece.duration + 1200);
    });
  }

  function clearConfettiRain() {
    if (confettiRainIntervalRef.current !== null) {
      window.clearInterval(confettiRainIntervalRef.current);
      confettiRainIntervalRef.current = null;
    }

    if (confettiRainTimeoutRef.current !== null) {
      window.clearTimeout(confettiRainTimeoutRef.current);
      confettiRainTimeoutRef.current = null;
    }
  }

  function startConfettiRain(duration, amount, interval, spread) {
    clearConfettiRain();
    burstConfetti(amount, spread);

    confettiRainIntervalRef.current = window.setInterval(() => {
      burstConfetti(amount, spread);
    }, interval);

    confettiRainTimeoutRef.current = window.setTimeout(() => {
      clearConfettiRain();
    }, duration);
  }

  function revealExperience() {
    clearConfettiRain();
    setRevealed(true);
    setWished(false);
    startConfettiRain(5000, 10, 220, 2400);
  }

  function toggleNote() {
    setNoteOpen((current) => !current);
  }

  function makeWish() {
    clearConfettiRain();
    setRevealed(true);
    setWished(true);
    startConfettiRain(5000, 10, 220, 2600);
  }

  function replayMoment() {
    clearConfettiRain();
    setNoteOpen(false);
    setWished(false);
    revealExperience();
  }

  const cakeStateClass = [
    "cake-card",
    revealed ? "is-lit" : "",
    wished ? "is-wished" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const noteClassName = `note-card${noteOpen ? " is-open" : ""}`;
  const pageShellClass = [
    "page-shell",
    introPhase === "site" ? "is-visible" : "",
    revealed ? "revealed" : ""
  ]
    .filter(Boolean)
    .join(" ");
  const countdownDisplay = Math.max(countdown, 1);
  const overlayClassName = [
    "countdown-overlay",
    introPhase === "site" ? "is-hidden" : "is-active",
    introPhase === "birthday" ? "is-celebration" : "is-countdown"
  ]
    .filter(Boolean)
    .join(" ");
  const confettiLayerClass = [
    "confetti-layer",
    introPhase === "birthday" ? "is-overlay" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={overlayClassName} aria-hidden={introPhase === "site"}>
        {introPhase === "countdown" ? (
          <div className="countdown-panel">
            <p className="countdown-label">Amy&apos;s birthday surprise begins in</p>
            <div className="countdown-number">{countdownDisplay}</div>
          </div>
        ) : (
          <div className="countdown-panel celebration-panel">
            <p className="countdown-label">For Amy</p>
            <div className="celebration-title">HAPPY BIRTHDAY!!!</div>
          </div>
        )}
      </div>

      <div className="background" aria-hidden="true">
        <div className="background-blur blur-one"></div>
        <div className="background-blur blur-two"></div>
        <div className="background-grid"></div>
      </div>

      <main className={pageShellClass}>
        <section className="hero-card">
          <p className="eyebrow">Birthday mode for Amy</p>
          <h1>Happy Birthday, Amy!!!</h1>
          <p className="hero-copy">
            A quick little corner of the internet made to feel bright, playful,
            and completely yours for the day!
          </p>

          <div className="button-row">
            <button className="primary-button" type="button" onClick={revealExperience}>
              Celebrate again
            </button>
            <button className="secondary-button" type="button" onClick={toggleNote}>
              {noteOpen ? "Hide birthday note" : "Open birthday note"}
            </button>
          </div>
        </section>

        <section className="experience-grid">
          <article className={cakeStateClass}>
            <div className="spotlight"></div>
            <div className="cake-stage">
              <div className="cake">
                <div className="cake-glow"></div>
                <div className="cake-shadow"></div>
                <div className="stand">
                  <div className="stand-top"></div>
                  <div className="stand-stem"></div>
                  <div className="stand-base"></div>
                </div>
                <div className="plate"></div>
                <div className="plate-rim"></div>
                <div className="layer layer-bottom">
                  <div className="filling"></div>
                  <div className="trim trim-bottom"></div>
                  <div className="drips drips-bottom">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="layer layer-middle">
                  <div className="filling"></div>
                  <div className="trim trim-middle"></div>
                  <div className="drips drips-middle">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="layer layer-top">
                  <div className="sprinkles">
                    <span className="sprinkle rose"></span>
                    <span className="sprinkle gold"></span>
                    <span className="sprinkle cream"></span>
                    <span className="sprinkle rose"></span>
                    <span className="sprinkle gold"></span>
                    <span className="sprinkle cream"></span>
                  </div>
                  <div className="trim trim-top"></div>
                </div>
                <div className="icing icing-top"></div>
                <div className="berries" aria-hidden="true">
                  <span className="berry"></span>
                  <span className="berry"></span>
                  <span className="berry"></span>
                </div>
                <div className="candles">
                  <span className="candle"><span className="flame"></span></span>
                  <span className="candle"><span className="flame"></span></span>
                  <span className="candle"><span className="flame"></span></span>
                </div>
              </div>
            </div>

            <div className="cake-footer">
              <p className="cake-title">Wish station</p>
              <p className="cake-copy">
                Light the candles, make a wish, then let the confetti do its job.
              </p>
              <button className="primary-button" type="button" onClick={makeWish}>
                Make a wish
              </button>
            </div>
          </article>

          <aside className="story-card">
            <div className="story-block">
              <p className="story-label">A few words for Amy</p>
              <div className={noteClassName} aria-live="polite">
                <p>
                  Happy birthday, Amy! I hope this year brings more laughter,
                  more soft wins that turn into big ones, and more moments that
                  remind you how easy it is to root for you! I know we just met but I wish I was able to
                  celebrate your birthday with you but maybe next time LOL. Simple gift but
                  I hope you like it!!!
                </p>
              </div>
            </div>

            <div className="story-block">
              <p className="story-label">Mood board</p>
              <div className="tag-row">
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <button className="secondary-button wide-button" type="button" onClick={replayMoment}>
              Replay the moment
            </button>
          </aside>
        </section>
      </main>

      <div className={confettiLayerClass} aria-hidden="true">
        {confetti.map((piece) => {
          const className = ["confetti-piece", piece.variant].filter(Boolean).join(" ");

          return (
            <span
              key={piece.id}
              className={className}
              style={{
                "--drift": piece.drift,
                "--duration": `${piece.duration}ms`,
                "--left": piece.left,
                "--piece-color": piece.color,
                "--spin": piece.spin
              }}
            ></span>
          );
        })}
      </div>
    </>
  );
}
